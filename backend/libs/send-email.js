import axios from "axios";

/**
 * Hàm gửi email xác thực tài khoản qua Brevo API
 * @param {string} email - Email người nhận
 * @param {string} name - Tên người nhận
 * @param {string} verificationLink - Link xác thực (chứa token)
 */
const sendVerificationEmail = async (email, name, verificationLink) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: process.env.SENDER_EMAIL,
          name: "Manager SaaS Team", // Tên hiển thị người gửi
        },
        to: [{ email: email, name: name }],
        subject: "🔒 Kích hoạt tài khoản Manager SaaS của bạn",
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Xác thực tài khoản</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f4f7f9; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden;">
              <tr>
                <td style="padding: 30px; text-align: center; background-color: #000000;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">MANAGER SAAS</h1>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #333333; font-size: 20px; margin-top: 0;">Chào ${name},</h2>
                  <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                    Chào mừng cậu đến với hệ thống quản trị của chúng tớ! Để đảm bảo bảo mật và bắt đầu trải nghiệm, cậu vui lòng xác nhận địa chỉ email này là của mình.
                  </p>
                  
                  <div style="text-align: center; margin: 35px 0;">
                    <a href="${verificationLink}" 
                       style="background-color: #007bff; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; transition: background-color 0.3s;">
                       Xác thực tài khoản ngay
                    </a>
                  </div>
                  
                  <p style="color: #888888; font-size: 14px; line-height: 1.6;">
                    <strong>Lưu ý:</strong> Link này sẽ hết hạn sau 24 giờ. Nếu cậu không thực hiện yêu cầu này, hãy yên tâm bỏ qua email này.
                  </p>
                  
                  <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
                  
                  <p style="color: #aaaaaa; font-size: 12px; text-align: center;">
                    Nếu nút trên không hoạt động, cậu có thể truy cập link: <br>
                    <a href="${verificationLink}" style="color: #007bff; word-break: break-all;">${verificationLink}</a>
                  </p>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 20px; text-align: center; background-color: #f9f9f9; color: #999999; font-size: 12px;">
                  <p style="margin: 0;">&copy; 2026 Manager SaaS Team. Thủ Dầu Một, Bình Dương.</p>
                  <p style="margin: 5px 0 0;">Cậu nhận được email này vì đã đăng ký tài khoản trên hệ thống của chúng tớ.</p>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    console.log("✅ Email sent successfully to:", email);
    return response.data;
  } catch (error) {
    const errorData = error.response ? error.response.data : error.message;
    console.error("❌ Brevo API Error:", errorData);

    // Ném lỗi về cho Controller để thực hiện abortTransaction()
    throw new Error(`Email sending failed: ${JSON.stringify(errorData)}`);
  }
};
const sendRecoveryEmail = async (email, name, verificationLink) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: process.env.SENDER_EMAIL,
          name: "Manager SaaS Team", // Tên hiển thị người gửi
        },
        to: [{ email: email, name: name }],
        subject: "🔒 Cập nhật tài khoản Manager SaaS của bạn",
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Xác thực tài khoản</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f4f7f9; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden;">
              <tr>
                <td style="padding: 30px; text-align: center; background-color: #000000;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">MANAGER SAAS</h1>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #333333; font-size: 20px; margin-top: 0;">Chào ${name},</h2>
                  <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                    Chào mừng cậu đến với hệ thống quản trị của chúng tớ! Để đảm bảo bảo mật và bắt đầu trải nghiệm, cậu vui lòng xác nhận địa chỉ email này là của mình.
                  </p>
                  
                  <div style="text-align: center; margin: 35px 0;">
                    <a href="${verificationLink}" 
                       style="background-color: #007bff; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; transition: background-color 0.3s;">
                       Xác thực tài khoản ngay
                    </a>
                  </div>
                  
                  <p style="color: #888888; font-size: 14px; line-height: 1.6;">
                    <strong>Lưu ý:</strong> Link này sẽ hết hạn sau 24 giờ. Nếu cậu không thực hiện yêu cầu này, hãy yên tâm bỏ qua email này.
                  </p>
                  
                  <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
                  
                  <p style="color: #aaaaaa; font-size: 12px; text-align: center;">
                    Nếu nút trên không hoạt động, cậu có thể truy cập link: <br>
                    <a href="${verificationLink}" style="color: #007bff; word-break: break-all;">${verificationLink}</a>
                  </p>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 20px; text-align: center; background-color: #f9f9f9; color: #999999; font-size: 12px;">
                  <p style="margin: 0;">&copy; 2026 Manager SaaS Team. Thủ Dầu Một, Bình Dương.</p>
                  <p style="margin: 5px 0 0;">Cậu nhận được email này vì đã đăng ký tài khoản trên hệ thống của chúng tớ.</p>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    console.log("✅ Email sent successfully to:", email);
    return response.data;
  } catch (error) {
    const errorData = error.response ? error.response.data : error.message;
    console.error("❌ Brevo API Error:", errorData);

    // Ném lỗi về cho Controller để thực hiện abortTransaction()
    throw new Error(`Email sending failed: ${JSON.stringify(errorData)}`);
  }
};

const sendWorkspaceInviteEmail = async (email, workspaceName, inviteLink) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: process.env.SENDER_EMAIL,
          name: "Manager SaaS Team",
        },
        to: [{ email: email }],
        subject: `🚀 Lời mời tham gia không gian làm việc: ${workspaceName}`,
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Mời tham gia Workspace</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f4f7f9; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden;">
              <tr>
                <td style="padding: 30px; text-align: center; background-color: #4f46e5;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">MANAGER SAAS</h1>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #333333; font-size: 20px; margin-top: 0;">Chào bạn 👋,</h2>
                  <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                    Bạn vừa nhận được lời mời tham gia vào không gian làm việc <strong>${workspaceName}</strong> trên hệ thống của chúng tớ.
                  </p>
                  <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                    Gia nhập ngay để cùng đồng đội quản lý dự án và tối ưu hóa công việc hiệu quả nhất nhé!
                  </p>
                  
                  <div style="text-align: center; margin: 35px 0;">
                    <a href="${inviteLink}" 
                       style="background-color: #4f46e5; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
                       Chấp nhận lời mời
                    </a>
                  </div>
                  
                  <p style="color: #888888; font-size: 14px; line-height: 1.6;">
                    <strong>Lưu ý:</strong> Link mời này chỉ có hiệu lực trong vòng 24 giờ.
                  </p>
                  
                  <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
                  
                  <p style="color: #aaaaaa; font-size: 12px; text-align: center;">
                    Nếu nút trên không hoạt động, bạn có thể copy link này: <br>
                    <a href="${inviteLink}" style="color: #4f46e5; word-break: break-all;">${inviteLink}</a>
                  </p>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 20px; text-align: center; background-color: #f9f9f9; color: #999999; font-size: 12px;">
                  <p style="margin: 0;">&copy; 2026 Manager SaaS Team. Thủ Dầu Một, Bình Dương.</p>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    console.log("✅ Invite email sent successfully to:", email);
    return response.data;
  } catch (error) {
    const errorData = error.response ? error.response.data : error.message;
    console.error("❌ Brevo API Invite Error:", errorData);
    throw new Error(`Email sending failed: ${JSON.stringify(errorData)}`);
  }
};

export { sendVerificationEmail, sendRecoveryEmail, sendWorkspaceInviteEmail };
