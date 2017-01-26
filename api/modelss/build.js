const associate = ({ Build, BuildLog, Site, User }) => {
  Build.hasMany(BuildLog, {
    foreignKey: "build",
  })
  Build.belongsTo(Site, {
    foreignKey: "site",
  })
  Build.belongsTo(User, {
    foreignKey: "user",
  })
}

module.exports = (sequelize, DataTypes) => {
  const Build = sequelize.define("Build", {
    branch: {
      type: DataTypes.STRING,
    },
    completedAt: {
      type: DataTypes.DATE,
    },
    error: {
      type: DataTypes.STRING,
    },
    source: {
      type: DataTypes.JSON,
    },
    state: {
      type: DataTypes.ENUM,
      values: ["error", "processing", "skipped", "success"],
      defaultValue: "processing",
    },
    token: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: "build",
    classMethods: {
      associate,
    },
  })

  return Build
}
