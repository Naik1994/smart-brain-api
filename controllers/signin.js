export const signin = async (req, res, db, bcrypt) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
        return res.status(400).json('incorrect form submission');
    }

    db.select('hash', 'email').from('login').where({email})
    .then(async data => {
      const valid = await bcrypt.compare(password, data[0].hash)
      if (valid) {
        db.select('*').from('users').where({email})
        .then(user => res.json(user[0]))
        .catch(() => res.status(400).json('unable to get user'))
      } else {
        res.status(401).json('wrong credentials')
      }
    })
    .catch(() => res.status(400).json('wrong credentials'))
}