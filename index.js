const addUser = document.querySelector('.add-user-data')
addUser.addEventListener('submit', async (e) => {
    e.preventDefault()
    let fname = document.getElementById("fname").value
    let phone = document.getElementById("phone").value
    let email = document.getElementById("email").value

    let users = JSON.parse(localStorage.getItem('users')) || []
    
    let userId
    do {
        userId = `user_${Math.floor(Math.random() * 1000)}`
    } while (users.some(user => user.id === userId))
    
    const user = {
        id: userId,
        fname: fname,
        phone: phone,
        email: email,
        state: 'Active'
    }

    users.push(user)
    localStorage.setItem('users', JSON.stringify(users))

    new swal(`${fname} Added`)

    document.getElementById("fname").value = ""
    document.getElementById("phone").value = ""
    document.getElementById("email").value = ""

    $('#add-data').modal('hide')

     renderUserRow(user)
})


function renderUserRow(user) {
    const tableBody = document.querySelector('.data-table')
    const row = document.createElement('tr')
    
    row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.fname}</td>
        <td>${user.phone}</td>
        <td>${user.email}</td>
        <td>${user.state || 'N/A'}</td>
        <td><button class="btn btn-success mb-3" data-bs-toggle="modal" data-bs-target="#update-data" id="update_${user.id}">Update</button></td>
        <td><button class="btn btn-danger mb-3" id="delete_${user.id}">Delete</button></td>
    `

    tableBody.appendChild(row)

    const deleteBtn = document.getElementById(`delete_${user.id}`)
    deleteBtn.addEventListener('click', function () {
        deleteUser(user.id, row)
    })

    const updateBtn = document.getElementById(`update_${user.id}`)
    updateBtn.addEventListener('click', function() {
        populateUpdateModal(user)
    })
}

function populateUpdateModal(user) {
    document.getElementById("update-fname").value = user.fname
    document.getElementById("update-phone").value = user.phone
    document.getElementById("update-email").value = user.email
    const stateSelect = document.querySelector(".form-select")
    stateSelect.value = user.state || "Active" 
    stateSelect.dataset.userId = user.id
}

const searchInput = document.getElementById('search-input')
searchInput.addEventListener('input', function() {
    const query = searchInput.value.toLowerCase() 
    const users = JSON.parse(localStorage.getItem('users')) || [] 
    const tableBody = document.querySelector('.data-table')

   
    tableBody.innerHTML = ''

    const filteredUsers = users.filter(user => {
        return (
            user.fname.toLowerCase().includes(query) || 
            user.phone.includes(query) || 
            user.email.toLowerCase().includes(query)
        )
    })

     filteredUsers.forEach(user => renderUserRow(user))
})


const sortSelect = document.getElementById('sort-select')

sortSelect.addEventListener('change', function() {
    const selectedValue = sortSelect.value 
    let users = JSON.parse(localStorage.getItem('users')) || [] 
    if (selectedValue === "state") {
         users.sort((a, b) => a.state.localeCompare(b.state))
    } else if (selectedValue === "ascending") {
        users.sort((a, b) => a.fname.localeCompare(b.fname))
    } else if (selectedValue === "descending") {
        users.sort((a, b) => b.fname.localeCompare(a.fname))
    }

    const tableBody = document.querySelector('.data-table')
    tableBody.innerHTML = ''

    users.forEach(user => renderUserRow(user))
})

const updateUserForm = document.querySelector('.update-user-data')
updateUserForm.addEventListener('submit', function(e) {
    e.preventDefault()
    const userId = updateUserForm.querySelector('.form-select').dataset.userId 
    let users = JSON.parse(localStorage.getItem('users')) || []
    
    const updatedUser = users.find(user => user.id === userId)
    if (updatedUser) {
        updatedUser.fname = document.getElementById("update-fname").value
        updatedUser.phone = document.getElementById("update-phone").value
        updatedUser.email = document.getElementById("update-email").value
        updatedUser.state = document.getElementById("update-state").value 

        localStorage.setItem('users', JSON.stringify(users))

        const existingRow = document.getElementById(`update_${userId}`).closest('tr')
        existingRow.innerHTML = `
            <td>${updatedUser.id}</td>
            <td>${updatedUser.fname}</td>
            <td>${updatedUser.phone}</td>
            <td>${updatedUser.email}</td>
            <td>${updatedUser.state || 'N/A'}</td>
            <td><button class="btn btn-success mb-3" data-bs-toggle="modal" data-bs-target="#update-data" id="update_${updatedUser.id}">Update</button></td>
            <td><button class="btn btn-danger mb-3" id="delete_${updatedUser.id}">Delete</button></td>
        `

         const deleteBtn = existingRow.querySelector(`button[id^="delete_"]`)
        deleteBtn.addEventListener('click', function () {
            deleteUser(updatedUser.id, existingRow)
        })

        const updateBtn = existingRow.querySelector(`button[id^="update_"]`)
        updateBtn.addEventListener('click', function() {
            populateUpdateModal(updatedUser)
        })

        const modal = bootstrap.Modal.getInstance(document.getElementById('update-data'))
        modal.hide()
        
        new swal(`${updatedUser.fname} Updated`)
    }
})



function deleteUser(userId, row) {
    let title = 'Processed?'
    let text = `You are sure you want to delete!`

    Swal.fire({
        title: title,
        text: text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            const users = JSON.parse(localStorage.getItem('users')) || []
            const updatedUsers = users.filter(user => user.id !== userId)
            localStorage.setItem('users', JSON.stringify(updatedUsers))
            row.remove()
        }
    })
}


const users = JSON.parse(localStorage.getItem('users')) || []
const tableBody = document.querySelector('.data-table')
tableBody.innerHTML = ''
users.forEach(user => renderUserRow(user))




