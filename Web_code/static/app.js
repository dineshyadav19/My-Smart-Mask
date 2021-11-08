const form = document.querySelector('#reg-form')
form.addEventListener('submit', regUser)

async function regUser(event) {
    event.preventDefault()

    const username = document.querySelector('#username').value
    const password = document.querySelector('#password').value

    const result = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/JSON'
        },
        body: JSON.stringify({
            username,
            password
        }) 
    }).then((res)=>res.json())

    if(result.status === 'ok'){
        //everything went fine
        alert('Success')
    } else {
        alert(result.error)
    }
}

