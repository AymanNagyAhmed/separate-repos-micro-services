import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { EMAIL_REGEX } from '@/common/constants/validation.constants';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  versionKey: false
})
export class User {
  @Prop({ 
    type: SchemaTypes.String,
    required: false, 
    lowercase: true, 
    trim: true,
    default: null 
  })
  firstName?: string | null;

  @Prop({ 
    type: SchemaTypes.String,
    required: false, 
    lowercase: true, 
    trim: true,
    default: null 
  })
  lastName?: string | null;

  @Prop({ 
    type: SchemaTypes.String,
    required: true, 
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(value: string) {
        return EMAIL_REGEX.test(value);
      },
      message: 'Please enter a valid email address'
    }
  })
  email: string;

  @Prop({ 
    type: SchemaTypes.String,
    required: true 
  })
  password: string;

  @Prop({ 
    type: SchemaTypes.Boolean,
    default: false 
  })
  isEmailVerified: boolean;

  @Prop({ 
    type: SchemaTypes.String,
    default: 'user' 
  })
  role: string;

  @Prop({ 
    type: SchemaTypes.String,
    unique: true, 
    sparse: true,
    index: true,
    trim: true
  })
  phoneNumber?: string;

  @Prop({ 
    type: SchemaTypes.Boolean,
    default: true 
  })
  isActive: boolean;

  @Prop({ 
    type: [SchemaTypes.String],
    default: [] 
  })
  images: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Create compound index for name search
UserSchema.index({ firstName: 1, lastName: 1 });

// Add virtual field for fullName with null handling
UserSchema.virtual('fullName').get(function() {
  const nameParts = [];
  
  if (this.firstName) {
    nameParts.push(this.firstName);
  }
  
  if (this.lastName) {
    nameParts.push(this.lastName);
  }
  
  return nameParts.length > 0 ? nameParts.join(' ') : 'Anonymous User';
});

// Pre-save middleware to handle email and phone formatting
UserSchema.pre('save', function(next) {
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  if (this.phoneNumber) {
    this.phoneNumber = this.phoneNumber.trim();
  }
  if (this.firstName) {
    this.firstName = this.firstName.toLowerCase().trim();
  }
  if (this.lastName) {
    this.lastName = this.lastName.toLowerCase().trim();
  }
  next();
});
