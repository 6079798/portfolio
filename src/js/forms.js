import "core-js/es/array/from"
import "core-js/es/object/assign"
import "core-js/es/string/ends-with"

import MicroModal from "micromodal"
import Pristine from "pristinejs/dist/pristine.min.js"
import IMask from "imask"

const form = document.querySelector("form")
const initialFormHtml = form.innerHTML

Pristine.addValidator(
  "phone",
  value => /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/gm.test(value.trim()),
  "Некорректный номер",
  2,
  false
)

Pristine.addValidator(
  "name",
  value =>
    /^[a-zA-Zа-яА-Я]+(([',. -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$/gi.test(
      value.trim()
    ),
  "Некорректное имя",
  2,
  false
)

Pristine.addValidator(
  "email",
  value => /\S+@\S+\.\S+/gi.test(value.trim()),
  "Некорректный email",
  2,
  false
)

const validatorConfig = {
  classTo: "form__group",
  errorTextParent: "form__group",
  errorClass: "form__group--danger",
  successClass: "form__group--success",
  errorTextTag: "span",
  errorTextClass: "form__error",
}

let validator

const doSubmit = event => {
  event.preventDefault()
  const { target: form } = event
  validator = new Pristine(form, validatorConfig)
  const isValid = validator.validate()
  if (isValid) {
    const btn = form.querySelector("button[type=submit]")
    const data = new FormData(form)
    const req = new XMLHttpRequest()
    const url = "https://echo.htmlacademy.ru"
    req.open("POST", url, true)
    req.send(data)
    req.onreadystatechange = function() {
      if (req.readyState !== 4) return
      if (req.status !== 200) {
        alert("Ошибка отправки данных!")
      } else {
        console.log(req.responseText)
        renderSuccess(form)
      }
    }
    btn.innerText = "Загрузка..."
    btn.disabled = true
  }
}

const renderEmailInput = form => {
  const formGroup = document.createElement("div")
  formGroup.classList.add("form__group")
  formGroup.innerHTML = `
    <label for="email" class="form__label">Ваш email <sup>*</sup></label>    
    <input id="email" class="form__input" type="text"
    name="email"
    data-pristine-required    
    data-pristine-required-message="Обязательное поле"
    data-pristine-email
    >
  `
  form.insertBefore(formGroup, form.querySelector("button[type=submit]"))
}

const renderTextarea = form => {
  const formGroup = document.createElement("div")
  formGroup.classList.add("form__group")
  formGroup.innerHTML = `
    <label for="message" class="form__label">Ваш вопрос <sup>*</sup></label>    
    <textarea id="message" class="form__input form__input--textarea" name="text"
    data-pristine-required
    data-pristine-required-message="Обязательное поле" rows="3"></textarea>   
  `
  form.insertBefore(formGroup, form.querySelector("button[type=submit]"))
}

const resetForm = modal => {
  if (!modal) return
  const form = modal.querySelector("form")
  if (!form) return
  form.innerHTML = initialFormHtml
  if (validator && validator instanceof Pristine) {
    validator.reset()
    validator.destroy()
  }
}

const renderForm = (modal, title, isRequestForm) => {
  if (!modal) return
  const form = modal.querySelector("form")
  if (!form) return
  modal.querySelector("button[type=submit]").innerText = title
  modal.querySelector(".modal__title").innerText = title
  IMask(form.querySelector("#phone"), {
    mask: "+{7}(000)000-00-00",
    lazy: false,
  })
  if (isRequestForm) {
    renderEmailInput(form)
    renderTextarea(form)
  }
}

const renderSuccess = (
  form,
  title = "Спасибо!",
  message = "Я свяжусь с вами в течение 15 минут..."
) => {
  form.closest("div").innerHTML = `<div class="success-message">
<h2 class="success-message__title">${title}</h2>
<p class="section-text">${message}</p>
</div>`
}

document.addEventListener("click", ({ target }) => {
  if (!target.matches("[data-modal]")) return
  MicroModal.show("modal", {
    disableScroll: true,
    onShow: modal =>
      renderForm(
        modal,
        target.innerText,
        target.hasAttribute("data-request-form")
      ),
    onClose: modal => resetForm(modal),
  })
})

form.addEventListener("submit", doSubmit)
