const Message = require("../models/messageModel");
const User = require("../models/userModel");
const io = global.io;
const mongoose= require("mongoose")

exports.createMessage = async (req, res) => {
  try {
    const { receiverId, content, fileUrl } = req.body;
    // console.log("MesgCont",req.body)

     const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(400).json({ error: 'Receiver not found' });
    }

    const message = new Message({
      senderId: req.user._id,
      receiverId,
      content,
      fileUrl,
    });
    await message.save();

    if (io && receiverId) {
      io.to(receiverId.toString()).emit('newMessage', message);
    }
    res.status(201).json({response:message});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  const messages = await Message.find({
    $or: [
      { senderId: req.user._id, receiverId: req.params.userId },
      { senderId: req.params.userId, receiverId: req.user._id },
    ],
    isDeleted: false,
  }).populate("senderId receiverId");
  console.log("mesgCont", messages)
  res.json(messages);
};

exports.updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, fileUrl } = req.body;

    const message = await Message.findOne({
      _id: id,
      senderId: req.user._id,
      isDeleted: false,
    });

    if (!message) {
      return res
        .status(404)
        .json({ error: "Message not found or unauthorized" });
    }

    message.content = content || message.content;
    message.fileUrl = fileUrl || message.fileUrl;
    await message.save();
    if(io && message.receiverId){
    io.to(message.receiverId.toString()).emit("messageUpdated", message);
    }
    res.json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findOne({
      _id: new mongoose.Types.ObjectId(id),
      senderId:new mongoose.Types.ObjectId(req.user._id),
      isDeleted: false,
    });

    if (!message) {
      return res
        .status(404)
        .json({ error: "Message not found or unauthorized" });
    }

    message.isDeleted = true;
    await message.save();
if(io && message.receiverId){
    io.to(message.receiverId.toString()).emit("messageDeleted", { id });
}
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
