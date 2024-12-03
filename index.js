import express from "express"
import brevo from "@getbrevo/brevo";
import dotenv from "dotenv"
import cors from "cors"
dotenv.config()

const apiInstance = new brevo.TransactionalEmailsApi()
const app = express()
app.use(cors())
app.use(express.json())
async function sendEmail(res,body) {
    apiInstance.setApiKey(
        brevo.TransactionalEmailsApiApiKeys.apiKey,
        process.env.API_KEY
    )
    const smtpEmail = new brevo.SendSmtpEmail()
    smtpEmail.subject = body.subject
    smtpEmail.to = [{
        email: body.email, name: body.name
    }]
    smtpEmail.htmlContent = body.html
    smtpEmail.sender = {
        email: process.env.FROM,
        name: process.env.NAME
    }
    await apiInstance.sendTransacEmail(smtpEmail).then(
        () => {
            res.json({
                ok: true,
                message: "Email send successfully",
                setTo:body.email,
                name:body.name
            })
        }
    ).catch(
        (error) => {
            console.log(error)
            res.json({
                ok: false,
                message: "error",
                error
            })
        }
    )
}
app.post("/send", async (req, res) => {
    const body = req.body
    sendEmail(res,body)
})
app.listen(10000, () => {
    console.log("Server is running on port 10000")
})