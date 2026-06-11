import { DataTypes} from 'sequelize';
import sequelize from './connection.ts'; 

// Users Table
export const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  userName: {
    type: DataTypes.STRING(50),
    field: 'username', 
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING(50),
    field: 'first_name',
  },
  lastName: {
    type: DataTypes.STRING(50),
    field: 'last_name',
  }
}, {
  tableName: 'users',
  timestamps: true, 
  underscored: true 
});

// Habits Table
export const Habit = sequelize.define('Habit', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    field: 'user_id',
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  frequency: {
    type: DataTypes.STRING(20),
    allowNull: false, // daily, weekly, monthly
  },
  targetCount: {
    type: DataTypes.INTEGER,
    field: 'target_count',
    defaultValue: 1,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    field: 'is_active',
    defaultValue: true,
    allowNull: false,
  }
}, {
  tableName: 'habits',
  timestamps: true,
  underscored: true
});



// Entries Table
export const Entry = sequelize.define('Entry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  habitId: {
    type: DataTypes.UUID,
    field: 'habit_id',
    allowNull: false,
  },
  completionDate: {
    type: DataTypes.DATE,
    field: 'completion_date',
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  note: {
    type: DataTypes.TEXT,
  }
}, {
  tableName: 'entries',
  timestamps: true,
  underscored: true
});

// Tags Table
export const Tag = sequelize.define('Tag', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  color: {
    type: DataTypes.STRING(7),
    defaultValue: '#6B7280', 
  }
}, {
  tableName: 'tags',
  timestamps: true,
  underscored: true
});

// HabitTags (Junction Table)
export const HabitTag = sequelize.define('HabitTag', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  habitId: {
    type: DataTypes.UUID,
    field: 'habit_id',
    allowNull: false,
  },
  tagId: {
    type: DataTypes.UUID,
    field: 'tag_id',
    allowNull: false,
  }
}, {
  tableName: 'habit_tags',
  timestamps: true,
  underscored: true
});



// ==========================================
// 2. DEFINING RELATIONSHIPS (ASSOCIATIONS)
// ==========================================

// User <-> Habit (One-to-Many)
User.hasMany(Habit, { foreignKey: 'userId', onDelete: 'CASCADE' });
Habit.belongsTo(User, { foreignKey: 'userId' });

// Habit <-> Entry (One-to-Many)
Habit.hasMany(Entry, { foreignKey: 'habitId', onDelete: 'CASCADE' });
Entry.belongsTo(Habit, { foreignKey: 'habitId' });

// Habit <-> Tag (Many-to-Many via HabitTag)
Habit.belongsToMany(Tag, { through: HabitTag, foreignKey: 'habitId', onDelete: 'CASCADE' });
Tag.belongsToMany(Habit, { through: HabitTag, foreignKey: 'tagId', onDelete: 'CASCADE' });

// Optional: Explicitly mapping relationships back to the Junction table if needed
Habit.hasMany(HabitTag, { foreignKey: 'habitId', onDelete: 'CASCADE' });
HabitTag.belongsTo(Habit, { foreignKey: 'habitId' });
Tag.hasMany(HabitTag, { foreignKey: 'tagId', onDelete: 'CASCADE' });
HabitTag.belongsTo(Tag, { foreignKey: 'tagId' });