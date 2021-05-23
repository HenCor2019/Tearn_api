const User = require("../../models/User.model");
const jwt = require("jsonwebtoken");
const Course = require("../../models/Course.model");

const {
  validateLoginFacebook,
  validateUpdateToTutor,
  validateUpdateNormalUser,
  validateId,
} = require("./User.validator");

const insertUniqueId = (userArr, newData) => {
  if (!userArr?.length == 0 || !newData) return [];
  if (!newData || userArr.findIndex((data) => data == newData) != -1)
    return userArr;
  return [newData, ...userArr];
};

const UserController = {
  loginFacebook: async (req, res, next) => {
    try {
      await validateLoginFacebook(req.body);

      const { username, email, imgUrl } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        const newUser = new User({
          username,
          email,
          imgUrl,
          isTutor: false,
          favTutors: [],
          preferences: [],
        });
        newUser.urlTutors = `${process.env.BASE_URL}user/tutors/${newUser._id}`;

        const {
          _id: id,
          username: newUsername,
          email: newEmail,
          imgUrl: newImgUrl,
        } = await newUser.save();

        const token = jwt.sign(
          { id, newUsername, newEmail, newImgUrl },
          process.env.TOKEN_KEY,
          {
            expiresIn: "14d",
          }
        );

        return res.status(201).json({
          error: false,
          accessToken: token,
        });
      }

      const {
        _id: id,
        username: registerUsername,
        email: regiserEmail,
        imgUrl: registerImgUrl,
      } = user;

      const token = jwt.sign(
        { id, registerUsername, regiserEmail, registerImgUrl },
        process.env.TOKEN_KEY,
        {
          expiresIn: "14d",
        }
      );

      return res.status(200).json({
        error: false,
        accessToken: token,
      });
    } catch (error) {
      console.log({ error });
      next(error);
    }
  },
  allUser: async (req, res, next) => {
    try {
      const users = await User.find()
        .populate("preferences", {
          name: 1,
        })
        .populate("favTutors", {
          username: 1,
        });

      const mappedUsers = users.map(
        ({
          _id: id,
          username,
          email,
          imgUrl,
          preferences,
          favTutors,
          description,
          isTutor,
        }) => ({
          id,
          username,
          email,
          imgUrl,
          preferences,
          favTutors,
          description,
          isTutor,
        })
      );

      return res.status(200).json({
        error: false,
        results: mappedUsers,
      });
    } catch (error) {
      next(error);
    }
  },
  updateToTutor: async (req, res, next) => {
    try {
      await validateUpdateToTutor(req.body);
      const { id, courseId } = req.body;

      const user = await User.findOne({ _id: id });

      if (!user || !user.isTutor)
        throw { name: "notFoundError", message: "User don't found" };

      const course = await Course.findById(courseId);

      const preUpdateUser = {
        preferences:
          user.preferences ||
          insertUniqueId(user.preferences, req.body.preference),
        favTutors:
          user.favTutors || insertUniqueId(user.favTutors, req.body.favTutors),
        isTutor: true,
        fullName: req.body.fullName || user.fullName,
        dot: req.body.dot || user.dot,
        url: `${process.env.BASE_URL}user/tutor/${user._id}`,
        languages:
          user.languages || user.languages.concat([...req.body.languages]),
        subjectsId:
          req.body.subjectId ||
          insertUniqueId(user?.subjectsId, req.body?.subjectId),
        description: req.body.description || user.description,
        responseTime: req.body.responseTime || user.responseTime,
        puntutation: req.body.puntutation || user.puntutation || 0,
        commentaries:
          user.commentaries ||
          insertUniqueId(user.commentaries, req.body.commentary),
        reports: user.reports || insertUniqueId(user.reports, req.body.reports),
        courseId: user.courseId || req.body.courseId,
      };

      await User.findOneAndUpdate({ _id: id }, preUpdateUser);
      const newTutor = await User.findById(id);
      course.tutors = course.tutors.concat(newTutor);
      await course.save();

      return res.status(200).json({
        error: false,
        message: "User was updated sucessfuly",
      });
    } catch (error) {
      console.log({ error });
      next(error);
    }
  },
  updateNormalUser: async (req, res, next) => {
    try {
      await validateUpdateNormalUser(req.body);
      const { id } = req.body;

      const tutor = await User.findOne({
        _id: req.body?.favTutor,
      });

      if (!tutor?.isTutor)
        throw { name: "InvalidTutorError", message: "Cannot find the tutor" };

      const user = await User.findById(id);

      if (!user) throw { name: "notFoundError", message: "User don't found" };

      const preUpdateUser = {
        username: req.body.username || user.username,
        imgUrl: req.body.imgUrl || user.imgUrl,
        preferences: insertUniqueId(user?.preferences, req.body?.preference),
        favTutors: insertUniqueId(user?.favTutors, req.body?.favTutor),
      };

      await User.findOneAndUpdate({ _id: id }, preUpdateUser);

      return res.status(200).json({
        error: false,
        message: "User was updated sucessfuly",
      });
    } catch (error) {
      next(error);
    }
  },

  allTutors: async (req, res, next) => {
    try {
      const tutors = await User.find({ isTutor: true });

      const mappedTutors = tutors.map(
        ({ _id: id, fullName, url, imgUrl, description, responseTime }) => ({
          id,
          fullName,
          imgUrl,
          description,
          url,
          responseTime,
        })
      );

      return res.status(200).json({
        error: false,
        results: mappedTutors,
      });
    } catch (error) {
      next(error);
    }
  },
  oneTutor: async (req, res, next) => {
    try {
      await validateId(req.params);
      const { id } = req.params;
      const tutor = await User.findById(id);

      if (!tutor || !tutor.isTutor)
        throw { name: "InvalidTutorError", message: "Cannot find the tutor" };

      const {
        fullName,
        imgUrl,
        url,
        description,
        puntuation,
        languages,
        commentaries,
      } = tutor;

      return res.status(200).json({
        error: false,
        fullName,
        imgUrl,
        url,
        description,
        puntuation,
        languages,
        commentaries,
      });
    } catch (error) {
      console.log({ error });
      next(error);
    }
  },
  oneUser: async (req, res, next) => {
    try {
      await validateId(req.params);
      const { id } = req.params;
      const user = await User.findById(id).populate("favTutors", {
        url: 1,
      });

      if (user.isTutor)
        throw { name: "notFoundError", message: "Can't find the user" };

      return res.status(200).json({
        error: false,
        id: user._id,
        imgUrl: user.imgUrl,
        email: user.email,
        urlTutors: user.urlTutors,
        favTutors: user.favTutors,
      });
    } catch (error) {
      next(error);
    }
  },
  tutorsUser: async (req, res, next) => {
    try {
      await validateId(req.params);
      const { id: _id } = req.params;

      const tutors = await User.find({ _id })
        .populate({
          path: "favTutors",
          select: "username email subjectsId",
          populate: {
            path: "subjectsId",
            select: "name",
            model: "Subject",
          },
        })
        .populate("subjectsId", { name: 1 });
      const favTutors = tutors.map(({ favTutors }) => ({ ...favTutors }));

      return res.status(200).json({
        error: false,
        tutorsCount: tutors.length,
        favTutors,
      });
    } catch (error) {
      console.log({ error });
      next(error);
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      await validateId(req.params);

      const { id } = req.params;

      const user = await User.findById(id);
      console.log({ user });
      if (!user)
        throw { name: "InvalidTutorError", message: "Cannot find the tutor" };

      await User.findOneAndDelete(id);

      return res.status(200).json({
        error: false,
        message: "User was deleted",
      });
    } catch (error) {
      next(error);
    }
  },
  deleteAll: async (req, res, next) => {
    try {
      await User.deleteMany();
      return res.status(200).json({
        error: false,
        message: "Users was deleted",
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = UserController;
