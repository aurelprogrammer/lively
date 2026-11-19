
import { supabase } from './supabase.js';

// ==========================================
// SUPABASE INITIALIZATION
// ==========================================

console.log("LIVELY: Supabase berhasil diinisialisasi!");
console.log("Supabase Client:", supabase);


// ==========================================
// DOM CONTENT LOADED
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ======================================
    // CONCERT SEARCH & FILTER
    // ======================================

    const searchInput = document.getElementById("concertSearch");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const concertItems = document.querySelectorAll(".concert-item");
    const noConcert = document.getElementById("noConcert");

    if (searchInput && concertItems.length > 0) {

        let activeFilter = "all";

        function filterConcerts() {

            const keyword = searchInput.value.toLowerCase().trim();
            let visibleCount = 0;

            concertItems.forEach(item => {

                const name = (item.dataset.name || "").toLowerCase();
                const category = (item.dataset.category || "").toLowerCase();
                const text = item.textContent.toLowerCase();

                const matchesSearch =
                    name.includes(keyword) || text.includes(keyword);

                const matchesCategory =
                    activeFilter === "all" || category === activeFilter;

                const visible = matchesSearch && matchesCategory;

                item.style.display = visible ? "" : "none";

                if (visible) visibleCount++;
            });

            if (noConcert) {
                noConcert.hidden = visibleCount !== 0;
            }
        }

        searchInput.addEventListener("input", filterConcerts);

        filterButtons.forEach(button => {

            button.addEventListener("click", function () {

                filterButtons.forEach(btn =>
                    btn.classList.remove("active")
                );

                button.classList.add("active");
                activeFilter = button.dataset.filter;

                filterConcerts();
            });
        });

        filterConcerts();
    }


    // ======================================
    // SHOW PASSWORD
    // ======================================

    const showPassword = document.getElementById("showPassword");
    const passwordInput = document.getElementById("password");

    if (showPassword && passwordInput) {

        showPassword.addEventListener("change", function () {

            passwordInput.type = this.checked ? "text" : "password";

        });
    }


    // ======================================
    // LOGIN FORM
    // ======================================

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const message = document.getElementById("loginMessage");

            if (!email || !password) {

                message.textContent = "Mohon lengkapi semua data.";
                message.style.color = "red";

                return;
            }

            message.textContent =
                "Fitur login Supabase belum diaktifkan.";

            message.style.color = "orange";

        });
    }


    // ======================================
    // REGISTER FORM - SUPABASE AUTH
    // ======================================

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {

        registerForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword =
                document.getElementById("confirmPassword").value;

            const message = document.getElementById("registerMessage");

            if (name.length < 3) {

                message.textContent = "Nama minimal 3 karakter.";
                message.style.color = "red";

                return;
            }

            if (!email) {

                message.textContent = "Email wajib diisi.";
                message.style.color = "red";

                return;
            }

            if (password.length < 8) {

                message.textContent = "Password minimal 8 karakter.";
                message.style.color = "red";

                return;
            }

            if (password !== confirmPassword) {

                message.textContent = "Konfirmasi password tidak sama.";
                message.style.color = "red";

                return;
            }

            message.textContent = "Sedang membuat akun...";
            message.style.color = "blue";

            try {

                const { data, error } = await supabase.auth.signUp({

                    email: email,
                    password: password,

                    options: {
                        data: {
                            full_name: name
                        }
                    }

                });

                if (error) {
                    throw error;
                }

                if (data.session) {

                    message.textContent =
                        "Registrasi berhasil! Akun LIVELY kamu sudah dibuat.";

                } else {

                    message.textContent =
                        "Registrasi berhasil! Silakan cek email untuk verifikasi akun.";

                }

                message.style.color = "green";

                registerForm.reset();

            } catch (error) {

                console.error("Register error:", error);

                message.textContent =
                    "Registrasi gagal: " + error.message;

                message.style.color = "red";

            }

        });
    }


    // ======================================
    // LIVELY INITIALIZATION
    // ======================================

    console.log("LIVELY website berhasil dimuat!");

});
