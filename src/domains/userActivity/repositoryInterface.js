export class UserActivityRepositoryInterface {
  constructor() {
    this._inMemoryStore = [];
  }

  static get Model() {
    return undefined;
  }

  _generateId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  }

  _asDate(d) {
    if (!d) return null;
    const date = d instanceof Date ? d : new Date(d);
    return isNaN(date.getTime()) ? null : date;
  }

  _matchesFilter(item, filter = {}) {
    for (const key of Object.keys(filter)) {
      const val = filter[key];

      if (key === "timestamp" && typeof val === "object") {
        if (val.$gte) {
          const g = this._asDate(val.$gte);
          if (!g || new Date(item.timestamp) < g) return false;
        }
        if (val.$lte) {
          const l = this._asDate(val.$lte);
          if (!l || new Date(item.timestamp) > l) return false;
        }
        continue;
      }

      if (item[key] == null && val != null) return false;

      if (typeof val === "object") {
        return false;
      } else {
        if (String(item[key]) !== String(val)) return false;
      }
    }
    return true;
  }

  async save(logEntity) {
    const Model = this.constructor.Model;
    if (Model) {
      const doc = new Model(logEntity);
      return await doc.save();
    }

    const doc = {
      ...logEntity,
      _id: this._generateId(),
      timestamp: logEntity.timestamp ? new Date(logEntity.timestamp) : new Date(),
    };

    this._inMemoryStore.push(doc);
    return doc;
  }

  async find(query = {}, options = {}) {
    const Model = this.constructor.Model;
    const page = Math.max(1, parseInt(options.page || 1, 10));
    const limit = Math.max(1, Math.min(100, parseInt(options.limit || 20, 10)));
    const skip = (page - 1) * limit;

    if (Model) {
      const mongoQuery = Model.find(query);

      if (options.sort) mongoQuery.sort(options.sort);
      mongoQuery.skip(skip).limit(limit);

      const data = await mongoQuery.exec();
      const total = await Model.countDocuments(query);

      return {
        data,
        meta: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    }

    let filtered = this._inMemoryStore.filter(item =>
      this._matchesFilter(item, query)
    );

    if (options.sort) {
      const [field, dir] = Object.entries(options.sort)[0];
      filtered = filtered.sort((a, b) => {
        if (a[field] < b[field]) return dir === "desc" ? 1 : -1;
        if (a[field] > b[field]) return dir === "desc" ? -1 : 1;
        return 0;
      });
    }

    const total = filtered.length;
    const data = filtered.slice(skip, skip + limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
