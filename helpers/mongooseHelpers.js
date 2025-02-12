const crudOperations = {
  countDocuments: async (Model, filter = {}) => {
    return await Model.countDocuments(filter);
  },
  distinct: async (Model, field, filter = {}) => {
    return await Model.distinct(field, filter);
  },
  aggregate: async (Model, pipeline) => {
    return await Model.aggregate(pipeline);
  },
  insertOne: async (Model, docs) => {
    return await Model.insertOne(docs);
  },
  insertMany: async (Model, docs) => {
    return await Model.insertMany(docs);
  },
  create: async (Model, doc) => {
    return await Model.create(doc);
  },
  updateMany: async (Model, filter = {}, update, options = {}) => {
    return await Model.updateMany(filter, update, {
      upsert: true,
    });
  },
  updateOne: async (Model, filter = {}, update, options = {}) => {
    return await Model.updateOne(filter, update, options);
  },
  replaceOne: async (Model, filter = {}, replacement, options = {}) => {
    return await Model.replaceOne(filter, replacement, options);
  },
  deleteMany: async (Model, filter = {}) => {
    return await Model.deleteMany(filter);
  },
  deleteOne: async (Model, filter = {}) => {
    return await Model.deleteOne(filter);
  },
  find: async (Model, filter = {}, fields = {}, options) => {
    return await Model.find(filter, fields).populate(options);
  },
  findOne: async (Model, filter = {}, fields = {}, options = {}) => {
    return await Model.findOne(filter, fields, options);
  },
  findById: async (Model, id, fields = {}, options = {}) => {
    return await Model.findById(id, fields, options);
  },
  findOneAndDelete: async (Model, filter = {}, options = {}) => {
    return await Model.findOneAndDelete(filter, options);
  },
  findOneAndReplace: async (Model, filter = {}, replacement, options = {}) => {
    return await Model.findOneAndReplace(filter, replacement, options).exec();
  },
  findOneAndUpdate: async (Model, filter = {}, update, fields = {}) => {
    console.log(fields);

    return await Model.findOneAndUpdate(filter, update, {
      projection: fields,
      new: true,
      upsert: true,
    });
  },
};

module.exports = crudOperations;
