import AlertTypes from "../components/ui/AlertTypes";

const outputErrors = (errors, setAlert) => {
  try {
    errors.forEach(error => {
      setAlert(error, AlertTypes.DANGER)
    })
  } catch (err) {
    setAlert("Произошла непредвиденная ошибка!", AlertTypes.DANGER)
  }
}

export {
  outputErrors
}