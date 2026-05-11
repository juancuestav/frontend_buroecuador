<template>
  <q-page class="login-page full-height overflow-hidden">
    <!-- Fondo animado con ondas -->
    <div class="animated-background">
      <div class="wave wave-1"></div>
      <div class="wave wave-2"></div>
      <div class="wave wave-3"></div>
      <div class="floating-elements">
        <div class="floating-circle circle-1"></div>
        <div class="floating-circle circle-2"></div>
        <div class="floating-circle circle-3"></div>
        <div class="floating-circle circle-4"></div>
        <div class="floating-circle circle-5"></div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="main-content full-height flex items-center justify-center">
      <div class="login-container">
        <!-- Tarjeta de login -->
        <q-card class="login-card glass-card slide-in-up">
          <!-- Animación Lottie -->
          <div class="animation-section text-center">
            <div class="animation-wrapper floating-pulse">
              <lottie-player
                :animationData="loginJson"
                background="transparent"
                :speed="0.8"
                style="width: 180px; height: 180px"
                loop
                autoplay
              />
            </div>
          </div>

          <!-- Sección del formulario -->
          <q-card-section class="form-section q-px-xl q-pb-xl">
            <div class="welcome-text text-center q-mb-lg fade-in-up">
              <h2 class="text-h5 text-weight-light text-primary q-mb-sm">
                Bienvenidos a Trabajos Ecuador
              </h2>
              <p class="text-body1 text-grey-7">Inicie sesión con su cuenta</p>
            </div>

            <form @submit.prevent="login" class="login-form">
              <!-- Campo de correo -->
              <div class="input-group q-mb-lg">
                <q-input
                  v-model="loginUser.email"
                  type="email"
                  label="Correo Electrónico"
                  outlined
                  dense
                  class="modern-input"
                  @keyup.enter="login()"
                  @focus="onInputFocus"
                  @blur="onInputBlur"
                >
                  <template v-slot:prepend>
                    <q-icon name="email" color="primary" class="input-icon" />
                  </template>
                </q-input>
              </div>

              <!-- Campo de contraseña -->
              <div class="input-group q-mb-md">
                <q-input
                  v-model="loginUser.password"
                  :type="isPwd ? 'password' : 'text'"
                  label="Contraseña"
                  outlined
                  dense
                  class="modern-input"
                  hint="No comparta su contraseña con nadie"
                  @keyup.enter="login()"
                  @focus="onInputFocus"
                  @blur="onInputBlur"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" color="primary" class="input-icon" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer password-toggle"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>

              <!-- Opciones adicionales -->

              <!--  <q-toggle
                v-model="loginUser.remember_session"
                label="Recuérdame"
                color="primary"
                class="q-mb-sm"
              /> -->

              <!-- Botones de acción -->
              <div class="action-buttons">
                <q-btn
                  color="primary"
                  label="Iniciar sesión"
                  class="login-btn full-width q-mb-md"
                  :disabled="!enableLoginButton"
                  no-caps
                  unelevated
                  @click="login()"
                >
                </q-btn>

                <q-btn
                  :to="{ name: 'register' }"
                  label="Crear cuenta"
                  class="register-btn full-width"
                  flat
                  no-caps
                  replace
                />
              </div>
            </form>
          </q-card-section>

          <!-- Footer de la tarjeta -->
          <q-card-section class="card-footer text-center q-py-md">
            <div class="security-info text-center">
              <q-icon
                name="verified_user"
                color="positive"
                size="16px"
                class="q-mr-xs"
              />
              <span class="text-caption text-grey-6">Conexión segura SSL</span>
            </div>
          </q-card-section>
        </q-card>

        <!-- Stats flotantes -->
        <div class="floating-stats">
          <div class="stat-card stat-1 glass-mini fade-in-left">
            <q-icon name="work" color="primary" size="24px" />
            <div class="stat-number">500+</div>
            <div class="stat-label">Empleos</div>
          </div>

          <div class="stat-card stat-2 glass-mini fade-in-right">
            <q-icon name="business" color="secondary" size="24px" />
            <div class="stat-number">200+</div>
            <div class="stat-label">Empresas</div>
          </div>

          <div class="stat-card stat-3 glass-mini fade-in-left">
            <q-icon name="people" color="accent" size="24px" />
            <div class="stat-number">1000+</div>
            <div class="stat-label">Usuarios</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Testimonial flotante -->
    <div class="testimonial-float slide-in-right">
      <q-card class="testimonial-card glass-mini">
        <q-card-section class="q-pa-md">
          <div class="flex items-center q-mb-sm">
            <q-avatar size="32px" class="q-mr-sm">
              <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
            </q-avatar>
            <div>
              <div class="text-weight-medium text-caption">María González</div>
              <div class="text-caption text-grey-6">
                Encontró trabajo en 2 días
              </div>
            </div>
          </div>
          <p class="text-caption text-grey-8 q-mb-none">
            "Gracias a Trabajos Ecuador conseguí el empleo de mis sueños"
          </p>
          <div class="rating q-mt-xs">
            <q-icon
              name="star"
              color="amber"
              size="12px"
              v-for="n in 5"
              :key="n"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script src="./LoginPage.ts"></script>

<style lang="scss" scoped>
// Animaciones base
@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes wave {
  0%,
  100% {
    transform: translateX(0px);
  }
  50% {
    transform: translateX(-25px);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

@keyframes glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(25, 118, 210, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(25, 118, 210, 0.6);
  }
}

// Página principal
.login-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

// Fondo animado
.animated-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.wave {
  position: absolute;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  border-radius: 50%;
  animation: wave 20s linear infinite;

  &.wave-1 {
    top: -50%;
    left: -50%;
    animation-duration: 25s;
  }

  &.wave-2 {
    top: -30%;
    right: -50%;
    animation-duration: 30s;
    animation-direction: reverse;
  }

  &.wave-3 {
    bottom: -50%;
    left: -30%;
    animation-duration: 35s;
  }
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
}

.floating-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;

  &.circle-1 {
    width: 60px;
    height: 60px;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }

  &.circle-2 {
    width: 80px;
    height: 80px;
    top: 60%;
    right: 15%;
    animation-delay: 2s;
  }

  &.circle-3 {
    width: 40px;
    height: 40px;
    top: 80%;
    left: 20%;
    animation-delay: 4s;
  }

  &.circle-4 {
    width: 100px;
    height: 100px;
    top: 10%;
    right: 30%;
    animation-delay: 1s;
  }

  &.circle-5 {
    width: 50px;
    height: 50px;
    top: 40%;
    left: 70%;
    animation-delay: 3s;
  }
}

// Header
.header-transparent {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.slide-in-down {
  animation: slideInDown 0.8s ease-out;
}

.logo-container {
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transform: rotate(45deg);
    animation: glow 3s ease-in-out infinite;
  }
}

.logo-image {
  position: relative;
  z-index: 1;
}

.brand-text {
  position: relative;
}

.hover-glow {
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  }
}

// Contenido principal
.main-content {
  position: relative;
  z-index: 1;
  padding: 2rem;
}

.login-container {
  position: relative;
  max-width: 480px;
  width: 100%;
}

// Tarjeta de login
.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15),
    0 10px 30px rgba(25, 118, 210, 0.1);
  overflow: hidden;
  position: relative;
}

.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.8),
    transparent
  );
}

.slide-in-up {
  animation: slideInUp 0.8s ease-out;
}

// Sección de animación
.animation-section {
  background: linear-gradient(
    135deg,
    rgba(25, 118, 210, 0.05) 0%,
    rgba(156, 39, 176, 0.05) 100%
  );
  border-bottom: 1px solid rgba(25, 118, 210, 0.1);
}

.animation-wrapper {
  display: inline-block;
}

.floating-pulse {
  animation: float 3s ease-in-out infinite;
}

// Sección del formulario
.form-section {
  position: relative;
}

.welcome-text {
  margin-bottom: 2rem;
}

.fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}

// Grupos de input
.input-group {
  position: relative;
  transition: all 0.3s ease;

  &.focused {
    transform: translateY(-2px);

    .modern-input .q-field__control {
      box-shadow: 0 8px 25px rgba(25, 118, 210, 0.15);
    }

    .input-icon {
      transform: scale(1.1);
      color: #1976d2 !important;
    }
  }
}

.modern-input {
  .q-field__control {
    transition: all 0.3s ease;
    border-radius: 12px;
  }

  &:hover .q-field__control {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
}

.input-icon {
  transition: all 0.3s ease;
}

.success-icon {
  animation: fadeInUp 0.3s ease;
}

.password-toggle {
  transition: all 0.3s ease;

  &:hover {
    background: rgba(25, 118, 210, 0.1);
  }
}

// Opciones
.options-section {
  .remember-toggle {
    .q-toggle__label {
      color: #666;
      font-weight: 500;
    }
  }

  .forgot-password {
    font-weight: 500;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.login-btn {
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
  color: white;
  border: none;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.6s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(25, 118, 210, 0.4);

    &::before {
      left: 100%;
    }
  }

  &:disabled {
    opacity: 0.6;
    transform: none;
  }
}

.divider {
  position: relative;
  text-align: center;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
  }

  .divider-text {
    background: white;
    padding: 0 1rem;
    color: #999;
    font-size: 0.875rem;
    position: relative;
    z-index: 1;
  }
}

.register-btn {
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: #f5f5f5;
    transform: translateY(-1px);
  }
}

// Footer de la tarjeta
.card-footer {
  background: linear-gradient(
    135deg,
    rgba(245, 245, 245, 0.5) 0%,
    rgba(255, 255, 255, 0.8) 100%
  );
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.social-buttons {
  .social-btn {
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px) scale(1.1);
    }

    &.google-btn:hover {
      box-shadow: 0 8px 25px rgba(244, 67, 54, 0.3);
    }

    &.facebook-btn:hover {
      box-shadow: 0 8px 25px rgba(66, 103, 178, 0.3);
    }

    &.linkedin-btn:hover {
      box-shadow: 0 8px 25px rgba(0, 119, 181, 0.3);
    }
  }
}

// Stats flotantes
.floating-stats {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.stat-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  min-width: 80px;

  &.stat-1 {
    top: 20%;
    left: -120px;
    animation: fadeInLeft 1s ease-out 0.5s both;
  }

  &.stat-2 {
    top: 50%;
    right: -120px;
    animation: fadeInRight 1s ease-out 1s both;
  }

  &.stat-3 {
    bottom: 20%;
    left: -120px;
    animation: fadeInLeft 1s ease-out 1.5s both;
  }

  .stat-number {
    font-size: 1.5rem;
    font-weight: bold;
    color: #1976d2;
    line-height: 1;
  }

  .stat-label {
    font-size: 0.75rem;
    color: #666;
    margin-top: 0.25rem;
  }
}

.glass-mini {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

// Testimonial flotante
.testimonial-float {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 10;
  max-width: 280px;
  animation: slideInRight 1s ease-out 2s both;
}

.testimonial-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.rating {
  display: flex;
  gap: 2px;
}

// Responsive
@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .login-card {
    margin: 0;
    border-radius: 20px;
  }

  .floating-stats .stat-card {
    display: none;
  }

  .testimonial-float {
    display: none;
  }

  .animation-section {
    padding: 1rem;

    lottie-player {
      width: 200px !important;
      height: 200px !important;
    }
  }

  .form-section {
    padding: 1.5rem !important;
  }
}

@media (max-width: 480px) {
  .header-transparent .q-toolbar {
    padding: 0 1rem;
  }

  .brand-text .text-h5 {
    font-size: 1.2rem;
  }

  .welcome-text h2 {
    font-size: 1.5rem;
  }
}

// Efectos especiales para modo oscuro
.body--dark {
  .login-card {
    background: rgba(30, 30, 30, 0.95);
    color: white;
  }

  .card-footer {
    background: linear-gradient(
      135deg,
      rgba(45, 45, 45, 0.5) 0%,
      rgba(60, 60, 60, 0.8) 100%
    );
  }

  .divider::before {
    background: linear-gradient(90deg, transparent, #444, transparent);
  }

  .divider-text {
    background: #1e1e1e;
    color: #999;
  }
}

// Animaciones de entrada escalonadas
.fade-in-left {
  animation: fadeInLeft 0.8s ease-out;
}

.fade-in-right {
  animation: fadeInRight 0.8s ease-out;
}

// Mejoras de accesibilidad
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
