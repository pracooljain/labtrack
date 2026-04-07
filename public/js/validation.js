document.getElementById('registerForm').addEventListener('submit', function(e) {
  let valid = true;

  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameRegex = /^[a-zA-Z\s]{3,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

  if (!nameRegex.test(name.value.trim())) {
    name.classList.add('is-invalid');
    name.nextElementSibling.textContent = 'Name must be at least 3 letters';
    valid = false;
  } else {
    name.classList.remove('is-invalid');
  }

  if (!emailRegex.test(email.value.trim())) {
    email.classList.add('is-invalid');
    valid = false;
  } else {
    email.classList.remove('is-invalid');
  }

  if (!passwordRegex.test(password.value)) {
    password.classList.add('is-invalid');
    password.nextElementSibling.textContent = 
      'Password must be 6+ chars with uppercase, lowercase and number';
    valid = false;
  } else {
    password.classList.remove('is-invalid');
  }

  if (password.value !== confirmPassword.value) {
    confirmPassword.classList.add('is-invalid');
    confirmPassword.nextElementSibling.textContent = 'Passwords do not match';
    valid = false;
  } else {
    confirmPassword.classList.remove('is-invalid');
  }

  if (!valid) {
    e.preventDefault();
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const fields = ['name', 'email', 'password', 'confirmPassword'];
  fields.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', function() {
        el.classList.remove('is-invalid');
      });
    }
  });
});