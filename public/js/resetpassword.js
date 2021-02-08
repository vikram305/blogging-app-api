console.log('loaded client side javascript')

const resetPasswordForm = document.querySelector("form")
const passwordInput = document.getElementById("password")
const confirmPasswordInput = document.getElementById("confirmpassword")
const passwordForm = document.getElementById("passwordform")
const thanksText = document.getElementById("thanksText")

resetPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const password = passwordInput.value
    const confirmpassword = confirmPasswordInput.value
    console.log('password: ',password)
    console.log('confirm password', confirmpassword)
    
    if(password.length<8){
        alert('Password length must be of 8 character and more')
        return 
    }
    if(password!=confirmpassword){
        alert('Password and Confirm Password not matching')
        return 
    }

    const resetToken = `${window.location.href.substring(window.location.href.lastIndexOf('/')+1)}`
    // console.log(`reset token: ${resetToken}`)

    const url=`${window.location.protocol}//${window.location.host}/api/v1/auth/resetpassword/${resetToken}`
    // console.log(`reset url: ${url}`)

    const bodyData = {
        password: password
    };

    fetch(`${url}`, {
        method: 'PUT',
        body: JSON.stringify(bodyData),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        if(result.error){
            alert(`${result.error} please try again by getting new email`)
            // console.log(`result.success: ${result.success}`)
        } else{
            // console.log(`result.success: ${result.success}`)
            thanksText.style.display="block"
            passwordForm.style.display="none"
        }
    });
    

})