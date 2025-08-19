const User = require('../../Models/Auth/backenduser.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.status(200).json({
      message: "Token is valid",
      user: decoded, // optional: return decoded payload
    });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("roleAndPermission");
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    if(user.block) return res.status(400).json({ message: 'User Blocked' });


    const token = jwt.sign(
      { id: user._id, 
        role: user._id,
      },
      process.env.JWT_SECRET || 'appsquadz',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
      },
      roleAndPermission: user.roleAndPermission
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while logging in' });
  }
};

module.exports = {
  login,
  verifyToken
};