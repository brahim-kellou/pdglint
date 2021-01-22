const PROD_PDGLINT_API_ENDPOINT = "pdglint-api.azurewebsites.net"
const DEV_PDGLINT_API_ENDPOINT = "localhost:8000"

const _DEV_ = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

export const PDGLINT_API_ENDPOINT = _DEV_ ? DEV_PDGLINT_API_ENDPOINT : PROD_PDGLINT_API_ENDPOINT;