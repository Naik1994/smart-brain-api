export const handleRegister = async (req, res, db, bcrypt) => {
    const saltRounds = 10;
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json('incorrect form submission');
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    db.transaction(trx => {
      trx.insert({
        hash: hashedPassword,
        email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
        .returning('*')
        .insert({
          name,
          email: loginEmail[0].email,
          joined: new Date()
        })
        .then(user => res.json(user[0]))
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(() => res.status(400).json('unable to register!'))
};