export const profile = (req, res, db) => {
    const { id } = req.params;
    db.select("*").from('users').where({id})
    .then(data => {
      if (data.length) {
        res.json(data[0]);
      } else {
        res.status(400).json("User not found!")
      }
    })
    .catch(() => res.status(400).json("Error fetching profile"))
};