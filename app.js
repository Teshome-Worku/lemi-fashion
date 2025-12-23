require("dotenv").config();
const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const axios = require("axios");
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const nodemailer = require("nodemailer");
const PORT = process.env.PORT || 3000;
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;
const server = http.createServer((req, res) => {
            if (req.url.startsWith("/public/")) {
                const filePath = path.join(__dirname, req.url);
                fs.readFile(filePath, (err, content) => {
                    if (err) {
                        res.writeHead(404);
                        res.end("File not found");
                    } else {
                        let ext = path.extname(filePath);
                        let contentType = "text/plain";
                        if (ext === ".css") contentType = "text/css";
                        else if (ext === ".js") contentType = "application/javascript";
                        else if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
                        else if (ext === ".ico") contentType = "image/x-icon";
                        else if (ext === ".html") contentType = "text/html";
                        res.writeHead(200, { "Content-Type": contentType });
                        res.end(content);
                    }
                });
            } else if (req.url === "/sendMail" && req.method === "POST") {
                let body = "";

                req.on("data", chunk => {
                    body += chunk.toString();
                });
                req.on("end", () => {
                            const formData = JSON.parse(body);
                            const { name, phone, email, message, total, cartItems } = formData;

                            console.log("Form Data Received:", formData);
                            const transporter = nodemailer.createTransport({
                                service: process.env.EMAIL_SERVICE,
                                auth: {
                                    user: process.env.EMAIL_USER,
                                    pass: process.env.EMAIL_PASS
                                },
                            });
                            let cartHTML = `
                    <h3>🛍️ Order Summary</h3>
                    <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; text-align:left;">
                        <thead>
                            <tr style="background-color:#f8f8f8;">
                                <th>Image</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                    `;

                            (cartItems || []).forEach((item, i) => {
                                cartHTML += `
                            <tr>
                                <td><img src="cid:image${i}" alt="${item.title}" width="60" height="60" style="border-radius:6px; object-fit:cover;"></td>
                                <td>${item.title}</td>
                                <td>${item.quantity}</td>
                                <td>${item.price}</td>
                            </tr>
                        `;
                            });

                            cartHTML += `
                        </tbody>
                    </table>
                    <h4 style="text-align:right; margin-top:10px;">Total: ${total}</h4>
                        `;
                            const attachments = (cartItems || [])
                                .filter(item => item.img) // only include those with images
                                .map((item, i) => ({
                                    filename: item.img,
                                    path: path.join(__dirname, "public", "images", item.img),
                                    cid: `image${i}`
                                }));

                            const htmlContent = `
                    <div style="font-family:Arial, sans-serif; line-height:1.6;">
                        <h2>🧾 New Order from ${name}</h2>
                        <p><b>Phone:</b> ${phone}</p>
                        <p><b>Email:</b> ${email}</p>
                        <p><b>Message:</b> ${message}</p>
                        ${cartHTML}
                    </div>
                    `;
                            const mailOptions = {
                                from: email,
                                to: process.env.OWNER_EMAIL,
                                subject: `🛍️ New Order from ${name}`,
                                html: htmlContent,
                                attachments: attachments,
                                replyTo: email,
                            };
                            try {
                                transporter.sendMail(mailOptions, (error, info) => {
                                    if (error) {
                                        return console.log('Error while sending mail:', error);
                                    }
                                    console.log('Email sent successfully:', info.response);
                                });
                            } catch (err) {
                                console.log('Exception caught while sending email:', err);
                            }
                            const msg = `Name: ${formData.name}\nPhone :${formData.phone}\nEmail: ${formData.email}\nMessage: ${formData.message}\nTotal:${total}\n----Cart items----:\nItem Title:${cartItems.title}\nItem price:${cartItems.price}\nItem Image:${cartItems.img}\nItem Quantity:${cartItems.quantity}---\n`;
                            fs.appendFile("messages.txt", msg, (err) => {
                                if (err) console.log("Error saving message:", err);
                                else console.log("Message saved!");
                            });
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(JSON.stringify({ status: "success", name: formData.name }));


                            let messageText = `
                            🛍️ *New Order from Lemi Fashion* 🛍️

                            👤 Name: ${name}
                            📞 Phone: ${phone}
                            📧 Email: ${email}
                            💬 Message: ${message}
                            🛒 *Cart Summary:*
                            ${cartItems.map(item=>
                                `   👜 Item Name:${item.title}  
                                    💵 Price: ${item.price}  
                                    🔢 Quantity: ${item.quantity}`
                                    ).join("\n\n")};

                            💰  Total: ${total}
                            `;
            try {
                fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            chat_id: CHAT_ID,
                            text: messageText,
                            parse_mode: "Markdown"
                        }),
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (!data.ok) console.log("Telegram error:", data);
                        else console.log("Order sent to Telegram!");
                    });
            } catch (err) {
                console.log("Telegram send failed:", err);
            }


            // async function sendTelegramOrder(formData) {
            //     const { name, phone, email, message, total, cartItems } = formData;

            //     // 1️⃣ Send main order summary text
            //     const messageText = `
            //             🛍️ *New Order from Lemi Fashion* 🛍️

            //             👤 Name: ${name}
            //             📞 Phone: ${phone}
            //             📧 Email: ${email}
            //             💬 Message: ${message}
            //             *Summary*
            //             👜 Item Name:${item.title}
            //             💵 Price: ${item.price}
            //             🔢 Quantity: ${item.quantity}

            //             💰 *Total:* ${total}
            //             `;

            //     await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            //         method: "POST",
            //         headers: { "Content-Type": "application/json" },
            //         body: JSON.stringify({
            //             chat_id: CHAT_ID,
            //             text: messageText,
            //             parse_mode: "Markdown"
            //         })
            //     });

            //     for (const item of cartItems) {
            //         const caption = `
            //             👜 Item Name:${item.title}
            //             💵 Price: ${item.price}
            //             🔢 Quantity: ${item.quantity}
            //           `;

            //         await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`, {
            //             method: "POST",
            //             headers: { "Content-Type": "application/json" },
            //             body: JSON.stringify({
            //                 chat_id: CHAT_ID,
            //                 photo: item.img, // full image URL
            //                 caption,
            //                 parse_mode: "Markdown"
            //             })
            //         });
            //     }
            // }
            // sendTelegramOrder(formData)
            //     .then(() => console.log("Telegram message sent!"))
            //     .catch(err => console.error("Telegram error:", err));
        });
    } else {
        let filePath = path.join(__dirname, "public", req.url === "/" ? "index.html" : req.url + ".html");
        fs.readFile(filePath, (err, content) => {
            if (err) {
                fs.readFile(path.join(__dirname, "pages", "404.html"), (err, data) => {
                    res.writeHead(404, { "Content-Type": "text/html" });
                    res.end(data);
                });
            } else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(content);
            }
        });
    }

});
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));