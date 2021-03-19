
const modalWrapper = document.querySelector('.modal-wrapper');
// modal add
const addModal = document.querySelector('.add-modal');
const addModalForm = document.querySelector('.add-modal .form');

// modal edit
const editModal = document.querySelector('.edit-modal');
const editModalForm = document.querySelector('.edit-modal .form');

const btnAdd = document.querySelector('.btn-add');

const tableUsers = document.querySelector('.table-users');

let id;

// Create element and render users
const renderUser = doc => {
    const tr = `
      <tr data-id='${doc.id}'>
        <td>${doc.data().Name}</td>
        <td>${doc.data().phone}</td>
        <td>${doc.data().date}</td>
        <td>
          <button class="btn btn-edit" href="#">Update User</button>
          <button class="btn btn-delete" href="#">Delete User</button>
        </td>
      </tr>
    `;
    tableUsers.insertAdjacentHTML('beforeend', tr);

    // Click add user button
    btnAdd.addEventListener('click', () => {
    addModal.classList.add('modal-show');
  
    addModalForm.Name.value = '';
    addModalForm.phone.value = '';
    addModalForm.date.value = '';
  });

    // Click edit user
    const btnEdit = document.querySelector(`[data-id='${doc.id}'] .btn-edit`);
    btnEdit.addEventListener('click', () => {
    editModal.classList.add('modal-show');

    id = doc.id;
    editModalForm.Name.value = doc.data().Name;
    editModalForm.phone.value = doc.data().phone;
    editModalForm.date.value = doc.data().date;

  });
  // Click delete user
  const btnDelete = document.querySelector(`[data-id='${doc.id}'] .btn-delete`);
  btnDelete.addEventListener('click', () => {
    db.collection('users').doc(`${doc.id}`).delete().then(() => {
      console.log('Document succesfully deleted!');
    }).catch(err => {
      console.log('Error removing document', err);
    });
  });

}
  // User click anyware outside the modal
  window.addEventListener('click', e => {
    if(e.target === addModal) {
      addModal.classList.remove('modal-show');
    }
    if(e.target === editModal) {
      editModal.classList.remove('modal-show');
    }
  });

  // Real time listener
db.collection('users').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      if(change.type === 'added') {
        renderUser(change.doc);
      }
      if(change.type === 'removed') {
        let tr = document.querySelector(`[data-id='${change.doc.id}']`);
        let tbody = tr.parentElement;
        tableUsers.removeChild(tbody);
      }
      if(change.type === 'modified') {
        let tr = document.querySelector(`[data-id='${change.doc.id}']`);
        let tbody = tr.parentElement;
        tableUsers.removeChild(tbody);
        renderUser(change.doc);
      }
    })
  })

  // Click submit in add modal
addModalForm.addEventListener('submit', e => {
  e.preventDefault();
  db.collection('users').add({
    Name: addModalForm.Name.value,
    phone: addModalForm.phone.value,
    date: addModalForm.date.value,
  });
  modalWrapper.classList.remove('modal-show');
});

  // Click submit in edit modal
  editModalForm.addEventListener('submit', e => {
    e.preventDefault();
    db.collection('users').doc(id).update({
      Name: editModalForm.Name.value,
      phone: editModalForm.phone.value,
      date: editModalForm.date.value,
    });
    editModal.classList.remove('modal-show');
    
  });
