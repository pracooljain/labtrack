
document.getElementById('registerForm').addEventListener('submit', function(e) {
  let valid = true;

  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');


  if (password.value.length < 6) {
    password.classList.add('is-invalid');
    valid = false;
  } else {
    password.classList.remove('is-invalid');
  }

  
  if (password.value !== confirmPassword.value) {
    confirmPassword.classList.add('is-invalid');
    valid = false;
  } else {
    confirmPassword.classList.remove('is-invalid');
  }

  
  if (!valid) {
    e.preventDefault();
  }
});