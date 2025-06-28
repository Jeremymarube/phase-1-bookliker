document.addEventListener("DOMContentLoaded", function() {});


const currentUser = { id: 1, username: "pouros" };

document.addEventListener('DOMContentLoaded', () => {
  fetchBooks();
});

function fetchBooks() {
  fetch('http://localhost:3000/books')
    .then(resp => {
      if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
      return resp.json();
    })
    .then(books => {
      const ul = document.getElementById('list');
      ul.innerHTML = '';
      books.forEach(book => {
        const li = document.createElement('li');
        li.textContent = book.title;
        li.setAttribute('tabindex', '0');
        li.addEventListener('click', () => showBookDetails(book));
        li.addEventListener('keypress', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            showBookDetails(book);
          }
        });
        ul.appendChild(li);
      });
    })
    .catch(error => {
      alert('Failed to load books. Please try again later.');
      console.error('Fetch error:', error);
    });
}

function showBookDetails(book) {
  const panel = document.getElementById('show-panel');
  panel.innerHTML = '';

  const img = document.createElement('img');
  img.src = book.img_url;
  img.alt = `Cover image of ${book.title}`;

  const desc = document.createElement('p');
  desc.textContent = book.description;

  const likedByHeading = document.createElement('h3');
  likedByHeading.textContent = 'Liked by:';

  const usersList = document.createElement('ul');
  usersList.id = 'users-list';
  if (book.users.length === 0) {
    const noLikes = document.createElement('li');
    noLikes.textContent = "No likes yet.";
    usersList.appendChild(noLikes);
  } else {
    book.users.forEach(user => {
      const userLi = document.createElement('li');
      userLi.textContent = user.username;
      usersList.appendChild(userLi);
    });
  }

  const likeButton = document.createElement('button');
  likeButton.textContent = hasUserLiked(book.users) ? 'UNLIKE' : 'LIKE';
  likeButton.addEventListener('click', () => toggleLike(book));

  panel.appendChild(img);
  panel.appendChild(desc);
  panel.appendChild(likedByHeading);
  panel.appendChild(usersList);
  panel.appendChild(likeButton);
}

function hasUserLiked(users) {
  return users.some(user => user.id === currentUser.id);
}

function toggleLike(book) {
  let updatedUsers;
  if (hasUserLiked(book.users)) {
    updatedUsers = book.users.filter(user => user.id !== currentUser.id);
  } else {
    updatedUsers = [...book.users, currentUser];
  }

  fetch(`http://localhost:3000/books/${book.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ users: updatedUsers }),
  })
  .then(resp => {
    if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
    return resp.json();
  })
  .then(updatedBook => showBookDetails(updatedBook))
  .catch(err => {
    alert('Could not update like status. Please try again.');
    console.error('Error:', err);
  });
}

