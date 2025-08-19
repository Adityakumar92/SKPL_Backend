const express = require('express');
const app = express();

const cors = require('cors');

// dotenv config
require('dotenv').config();
// mongodb connect
require('./Connection/connectMongoDB');

app.use(cors());
app.use(express.json());

const BackendUser = require('./Routes/User/backenduser.routes');
const User = require('./Routes/User/user.route');
const Role = require('./Routes/Role/role.routes');
const Site = require('./Routes/Site/site.routes');
const Building = require('./Routes/Building/building.routes');
const Checklist = require('./Routes/Checklist/checklist.routes');
const Activity = require('./Routes/Activity/activity.routes');
const Item = require('./Routes/Item_Material/item.routes');
const UserInput = require('./Routes/User_Input/userInput.routes');

app.use('/api/user', BackendUser);
app.use('/api/normaluser', User);
app.use('/api/role', Role);
app.use('/api/site', Site);
app.use('/api/building', Building);
app.use('/api/checklist', Checklist);
app.use('/api/activity', Activity);
app.use('/api/item', Item);
app.use('/api/input', UserInput);


port=process.env.PORT || 8000;
app.listen(port, ()=>{
    console.log(`Server running on port: ${port}`);
})