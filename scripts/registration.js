import '../scss/registration.scss';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); 
            alert('Form submitted!');
        })
    }
})