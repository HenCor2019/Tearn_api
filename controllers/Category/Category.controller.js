const Category = require("../../models/Category.model");
const parseError = require("../../utils/parseError");
const {
  validateCreation,
  validateOneCategory,
  validateUpdate,
  validateDelete,
} = require("./Category.validator");

const defaultImg =
  "https://img.lovepik.com/free_png/28/89/77/20c58PICzbbWHtc9KEQz8_PIC2018.png_860.png";

const CategoryController = {
  createCategory: async (req, res, next) => {
    try {
      await validateCreation(req.body);

      const { name, description, imgUrl = defaultImg } = req.body;

      const category = await Category.find({ name });

      if (category.length != 0)
        throw { name: "existError", message: "category already exist" };

      const newCategory = new Category({
        name,
        description,
        imgUrl,
        url: process.env.BASE_URL,
        subjects: [],
      });

      newCategory.url += `category/${newCategory._id}`;

      await newCategory.save();

      return res
        .status(201)
        .json({ error: false, message: "Category was created" })
        .end();
    } catch (error) {
      next(parseError(error));
    }
  },

  allCategories: async (req, res, next) => {
    try {
      const categories = await Category.find({});

      const mappedCategories = categories.map(({ _id, name, imgUrl, url }) => ({
        id: _id,
        name,
        imgUrl,
        url,
      }));

      return res
        .status(200)
        .json({
          error: false,
          count: categories.length,
          results: mappedCategories,
        })
        .end();
    } catch (error) {
      next(error);
    }
  },
  oneCategory: async (req, res, next) => {
    try {
      await validateOneCategory(req.params);

      const { id } = req.params;

      const category = await Category.findById(id).populate({
        path: "subjects",
        select: "name url",
        populate: {
          path: "courses",
          select: "name url",
          model: "Course",
        },
      });

      if (!category)
        throw { name: "notFoundError", message: "Category not found" };

      const { name, url, imgUrl, description, subjects } = category;

      return res
        .status(200)
        .json({
          error: false,
          id,
          name,
          url,
          imgUrl,
          description,
          subjectCount: subjects.length,
          subjects,
        })
        .end();
    } catch (error) {
      next(parseError(error));
    }
  },

  update: async (req, res, next) => {
    try {
      await validateUpdate(req.body);

      const { _id } = req.body;

      const categories = await Category.find({
        $or: [{ _id }, { name: req.body?.name }],
      });

      if (categories.length === 0 || categories.length > 1)
        throw { name: "updateError", message: "Cannot update categories" };

      const category = await Category.findById(_id);

      const updatedCategory = {
        name: req.body.name || category.name,
        description: req.body.description || category.description,
        imgUrl: req.body.imgUrl || category.imgUrl,
      };

      await Category.findOneAndUpdate({ _id: category._id }, updatedCategory);

      return res
        .status(200)
        .json({
          error: false,
          message: "Category was updated",
        })
        .end();
    } catch (error) {
      next(parseError(error));
    }
  },
  deleteOne: async (req, res, next) => {
    try {
      await validateDelete(req.params);
      const { id } = req.params;

      await Category.findOneAndDelete(id);

      return res
        .status(200)
        .json({ error: false, message: "Category deleted" });
    } catch (error) {
      next(parseError(error));
    }
  },
  deleteAll: async (req, res, next) => {
    try {
      await Category.deleteMany({});
      return res
        .status(200)
        .json({ error: false, message: "Categories was deleted" });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = CategoryController;
