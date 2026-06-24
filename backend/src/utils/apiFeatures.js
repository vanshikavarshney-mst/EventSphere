/**
 * apiFeatures.js
 * --------------------------------------------------
 * A small reusable helper class that adds:
 *   - Search   (?search=tech)
 *   - Filter   (?category=Workshop&status=Upcoming)
 *   - Sort     (?sort=date or ?sort=-date for descending)
 *   - Pagination (?page=1&limit=10)
 *
 * to any Mongoose query. Keeps controllers/services clean by
 * moving this repetitive query-building logic into one place.
 *
 * Usage:
 *   const features = new ApiFeatures(Event.find(), req.query)
 *     .search(["title"])
 *     .filter(["category", "status", "date"])
 *     .sort()
 *     .paginate();
 *
 *   const events = await features.query;
 */
class ApiFeatures {
  constructor(query, queryString) {
    this.query = query; // Mongoose query object, e.g. Event.find()
    this.queryString = queryString; // req.query from Express
  }

  // Case-insensitive partial text search on the given fields
  search(fields = []) {
    if (this.queryString.search && fields.length > 0) {
      const searchRegex = { $regex: this.queryString.search, $options: "i" };
      const searchConditions = fields.map((field) => ({
        [field]: searchRegex,
      }));

      this.query = this.query.find({ $or: searchConditions });
    }
    return this;
  }

  // Exact-match filtering on whitelisted fields only
  filter(allowedFields = []) {
    const filterObj = {};

    allowedFields.forEach((field) => {
      if (this.queryString[field]) {
        filterObj[field] = this.queryString[field];
      }
    });

    this.query = this.query.find(filterObj);
    return this;
  }

  // Sort by a field, e.g. ?sort=date (ascending) or ?sort=-date (descending)
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt"); // newest first by default
    }
    return this;
  }

  // Simple page/limit based pagination
  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;
