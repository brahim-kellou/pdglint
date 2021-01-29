const fetchData = (url: string, data: any[]) => (
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(resp => resp.json())
)

export default fetchData;