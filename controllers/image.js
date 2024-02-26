const PAT = 'da5cc4152e0a4630b215635593127f87';
const USER_ID = 'dyoqrben51ya';       
const APP_ID = 'a401ec78a93d4b24b71df6b0e8f7d7e1';
const MODEL_ID = 'general-image-detection';
const MODEL_VERSION_ID = '1580bb1932594c93b7e2e04456af7c6f';    

export const faceRecognition = (req, res) => {
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
      },
      body: JSON.stringify({
        "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
        },
        "inputs": [
          {
            "data": {
              "image": {
                "url": req.body.imageUrl
              }
            }
          }
        ]
      })
    })
    .then(response => response.json())
    .then(data => {
        res.json(data);
    })
    .catch(() => res.status(400).json('unable to work with API'))
}

export const image = (req, res, db) => {
    const { id } = req.body;
    db('users').where({id}).increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0]))
    .catch(() => res.status(400).json("unable to get entries"))
};