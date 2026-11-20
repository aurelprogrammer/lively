
import { supabase } from './supabase.js';

// ==========================================
// SUPABASE INITIALIZATION
// ==========================================

console.log("LIVELY: Supabase berhasil diinisialisasi!");

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
    const loginMessage = document.getElementById("loginMessage");
    let isSigningIn = false;

    if (loginForm) {
        supabase.auth.getSession()
            .then(({ data, error }) => {
                if (error) throw error;
                if (data.session) {
                    window.location.replace("index.html");
                }
            })
            .catch(error => {
                console.error("Session check error:", error);
                if (loginMessage) {
                    loginMessage.textContent =
                        "Status login tidak dapat diperiksa. Silakan coba lagi.";
                    loginMessage.style.color = "red";
                }
            });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            if (isSigningIn) return;

            const emailInput = document.getElementById("email");
            const passwordInput = document.getElementById("password");
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const email = emailInput ? emailInput.value.trim() : "";
            const password = passwordInput ? passwordInput.value : "";

            if (!email || !password) {
                if (loginMessage) {
                    loginMessage.textContent = "Mohon lengkapi semua data.";
                    loginMessage.style.color = "red";
                }
                return;
            }

            isSigningIn = true;
            if (submitButton) submitButton.disabled = true;
            if (loginMessage) {
                loginMessage.textContent = "Sedang masuk...";
                loginMessage.style.color = "blue";
            }

            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) throw error;

                let session = data.session;
                if (!session) {
                    const sessionResult = await supabase.auth.getSession();
                    if (sessionResult.error) throw sessionResult.error;
                    session = sessionResult.data.session;
                }

                if (!session) {
                    throw new Error("Session login tidak tersedia. Silakan coba lagi.");
                }

                window.location.replace("index.html");
            } catch (error) {
                console.error("Login error:", error);
                if (loginMessage) {
                    loginMessage.textContent =
                        error.message === "Invalid login credentials"
                            ? "Email atau password salah."
                            : "Login gagal. " + error.message;
                    loginMessage.style.color = "red";
                }
                if (submitButton) submitButton.disabled = false;
                isSigningIn = false;
            }
        });
    }

    // ======================================
    // REGISTER FORM - SUPABASE AUTH
    // ======================================

    const registerForm = document.getElementById("registerForm");
    const registerMessage = document.getElementById("registerMessage");

    if (registerForm && registerMessage) {
        supabase.auth.getSession()
            .then(({ data, error }) => {
                if (error) throw error;
                if (data.session) {
                    window.location.replace("index.html");
                }
            })
            .catch(error => {
                console.error("Session check error:", error);
                if (registerMessage) {
                    registerMessage.textContent =
                        "Status login tidak dapat diperiksa. Silakan coba lagi.";
                    registerMessage.style.color = "red";
                }
            });
    }

    if (registerForm && registerMessage) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const nameInput = document.getElementById("name");
            const emailInput = document.getElementById("email");
            const passwordInput = document.getElementById("password");
            const confirmPasswordInput =
                document.getElementById("confirmPassword");
            const submitButton =
                registerForm.querySelector('button[type="submit"]');
            const name = nameInput ? nameInput.value.trim() : "";
            const email = emailInput ? emailInput.value.trim() : "";
            const password = passwordInput ? passwordInput.value : "";
            const confirmPassword = confirmPasswordInput
                ? confirmPasswordInput.value
                : "";

            if (name.length < 3) {
                registerMessage.textContent = "Nama minimal 3 karakter.";
                registerMessage.style.color = "red";
                return;
            }

            if (!email) {
                registerMessage.textContent = "Email wajib diisi.";
                registerMessage.style.color = "red";
                return;
            }

            if (password.length < 8) {
                registerMessage.textContent = "Password minimal 8 karakter.";
                registerMessage.style.color = "red";
                return;
            }

            if (password !== confirmPassword) {
                registerMessage.textContent = "Konfirmasi password tidak sama.";
                registerMessage.style.color = "red";
                return;
            }

            if (submitButton) submitButton.disabled = true;
            registerMessage.textContent = "Sedang membuat akun...";
            registerMessage.style.color = "blue";

            try {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name
                        }
                    }
                });

                if (error) throw error;

                if (data.session) {
                    registerMessage.textContent =
                        "Registrasi berhasil! Akun LIVELY berhasil dibuat.";
                } else {
                    registerMessage.textContent =
                        "Registrasi berhasil! Silakan cek email untuk verifikasi.";
                }

                registerMessage.style.color = "green";
                registerForm.reset();

            } catch (error) {
                console.error("Register error:", error);
                registerMessage.textContent =
                    "Registrasi gagal: " + error.message;
                registerMessage.style.color = "red";
            } finally {
                if (submitButton) submitButton.disabled = false;
            }
        });
    }

    // ======================================
    // AUTHENTICATED INDEX NAVBAR
    // ======================================

    const loginNavLink = document.getElementById("loginNavLink");
    const signupNavLink = document.getElementById("signupNavLink");
    const profileDropdown = document.getElementById("profileDropdown");
    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");
    const logoutButton = document.getElementById("logoutButton");
    const authMessage = document.getElementById("authMessage");

    if (profileDropdown && loginNavLink && signupNavLink) {
        let currentUserId = null;
        let hasAuthState = false;
        let profileRequestId = 0;
        let authEventVersion = 0;

        function setNavbarSignedOut() {
            loginNavLink.classList.remove("d-none");
            signupNavLink.classList.remove("d-none");
            profileDropdown.classList.add("d-none");
            if (authMessage) {
                authMessage.textContent = "";
                authMessage.classList.add("d-none");
            }
        }

        function getFallbackName(user) {
            const metadataName = user.user_metadata &&
                typeof user.user_metadata.full_name === "string"
                ? user.user_metadata.full_name.trim()
                : "";

            return metadataName || user.email || "Pengguna";
        }

        async function setNavbarSession(session) {
            const user = session ? session.user : null;
            const userId = user ? user.id : null;

            if (hasAuthState && userId === currentUserId) return;
            hasAuthState = true;
            currentUserId = userId;
            const requestId = ++profileRequestId;

            if (!user) {
                setNavbarSignedOut();
                return;
            }

            loginNavLink.classList.add("d-none");
            signupNavLink.classList.add("d-none");
            profileDropdown.classList.remove("d-none");
            if (authMessage) authMessage.classList.add("d-none");
            if (profileName) profileName.textContent = getFallbackName(user);
            if (profileEmail) profileEmail.textContent = user.email || "";

            try {
                const { data: profile, error } = await supabase
                    .from("profiles")
                    .select("full_name")
                    .eq("id", user.id)
                    .maybeSingle();

                if (requestId !== profileRequestId) return;
                if (error) {
                    console.error("Profile load error:", error);
                    return;
                }
                if (!profile) {
                    console.warn("No profile found for the signed-in user.");
                    return;
                }

                if (profileName && typeof profile.full_name === "string") {
                    profileName.textContent =
                        profile.full_name.trim() || getFallbackName(user);
                }
            } catch (error) {
                if (requestId === profileRequestId) {
                    console.error("Profile load error:", error);
                }
            }
        }

        supabase.auth.onAuthStateChange(
            (_event, session) => {
                const eventVersion = ++authEventVersion;
                window.setTimeout(() => {
                    if (eventVersion === authEventVersion) {
                        void setNavbarSession(session);
                    }
                }, 0);
            }
        );

        const sessionCheckVersion = authEventVersion;
        supabase.auth.getSession()
            .then(({ data, error }) => {
                if (error) throw error;
                if (sessionCheckVersion === authEventVersion) {
                    void setNavbarSession(data.session);
                }
            })
            .catch(error => {
                console.error("Session check error:", error);
            });

        if (logoutButton) {
            logoutButton.addEventListener("click", async function () {
                const originalText = logoutButton.textContent;
                logoutButton.disabled = true;
                logoutButton.textContent = "Sedang keluar...";
                if (authMessage) {
                    authMessage.textContent = "";
                    authMessage.classList.add("d-none");
                }

                try {
                    const { error } = await supabase.auth.signOut();
                    if (error) throw error;
                    window.location.replace("index.html");
                } catch (error) {
                    console.error("Logout error:", error);
                    if (authMessage) {
                        authMessage.textContent =
                            "Logout gagal. Silakan coba lagi.";
                        authMessage.classList.remove("d-none");
                    }
                    logoutButton.disabled = false;
                    logoutButton.textContent = originalText;
                }
            });
        }
    }


    // ======================================
    // LIVELY INITIALIZATION
    // ======================================

    console.log("LIVELY website berhasil dimuat!");

});
