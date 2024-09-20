const form = document.querySelector("form");
const fullName = document.getElementById("name");
const companyName = document.getElementById("company");
const mail = document.getElementById("email");
const phone = document.getElementById("phone");
const subject = document.getElementById("subject");
const message = document.getElementById("message");

function sendEmail() {
    const bodyMessage = `Full Name: ${fullName.value}<br> Compnay: ${companyName.value}<br> Email: ${mail.value}<br> Phone: ${phone.value}<br> Message: ${message.value}`;

    Email.send({
        Host : "smtp.elasticemail.com",
        Username : "biz@ymaelectric.com",
        Password : "4D68C58EC30F9F8FDEFF3EEDCA8B0AB0E8DB",
        To : 'biz@ymaelectric.com',
        From : "biz@ymaelectric.com",
        Subject : subject.value,
        Body : bodyMessage
    }).then(
      message => {
        if (message == "OK") {
            Swal.fire({
                title: "Success!",
                text: "Message Sent Successfully!",
                icon: "success"
            });
        }
      }
    );
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    sendEmail();
    form.reset();
    return false;    
});