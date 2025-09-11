class User {
  final String id;
  final String name;
  final String email;
  final String? phone;
  final String role;
  final String status;
  final bool emailVerified;
  final bool phoneVerified;
  final DateTime? lastLogin;
  final DateTime createdAt;
  final DateTime updatedAt;

  const User({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
    required this.role,
    required this.status,
    this.emailVerified = false,
    this.phoneVerified = false,
    this.lastLogin,
    required this.createdAt,
    required this.updatedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'],
      role: json['role'] ?? 'guard',
      status: json['status'] ?? 'active',
      emailVerified: json['email_verified'] ?? false,
      phoneVerified: json['phone_verified'] ?? false,
      lastLogin: json['last_login'] != null 
          ? DateTime.parse(json['last_login']) 
          : null,
      createdAt: DateTime.parse(json['created_at'] ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updated_at'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'role': role,
      'status': status,
      'email_verified': emailVerified,
      'phone_verified': phoneVerified,
      'last_login': lastLogin?.toIso8601String(),
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  User copyWith({
    String? id,
    String? name,
    String? email,
    String? phone,
    String? role,
    String? status,
    bool? emailVerified,
    bool? phoneVerified,
    DateTime? lastLogin,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      role: role ?? this.role,
      status: status ?? this.status,
      emailVerified: emailVerified ?? this.emailVerified,
      phoneVerified: phoneVerified ?? this.phoneVerified,
      lastLogin: lastLogin ?? this.lastLogin,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  // Role checks
  bool get isAdmin => role == 'admin';
  bool get isAgency => role == 'agency';
  bool get isGuard => role == 'guard';
  
  // Status checks
  bool get isActive => status == 'active';
  bool get isPending => status == 'pending';
  bool get isSuspended => status == 'suspended';
  
  // User initials for avatar
  String get initials {
    if (name.isEmpty) return 'U';
    final names = name.split(' ');
    if (names.length >= 2) {
      return '${names[0][0]}${names[1][0]}'.toUpperCase();
    }
    return name[0].toUpperCase();
  }
  
  // Formatted last login
  String get lastLoginFormatted {
    if (lastLogin == null) return 'Never';
    final now = DateTime.now();
    final difference = now.difference(lastLogin!);
    
    if (difference.inDays > 0) {
      return '${difference.inDays} days ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} hours ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes} minutes ago';
    } else {
      return 'Just now';
    }
  }

  @override
  String toString() {
    return 'User(id: $id, name: $name, email: $email, role: $role)';
  }
}

class CompanyProfile {
  final String id;
  final String userId;
  final String companyName;
  final String? licenseNumber;
  final String? address;
  final String? city;
  final String? state;
  final String? zipCode;
  final String? country;
  final String? website;
  final String? description;
  final String? logoUrl;
  final String verificationStatus;
  final Map<String, dynamic>? verificationDocuments;
  final DateTime createdAt;
  final DateTime updatedAt;

  CompanyProfile({
    required this.id,
    required this.userId,
    required this.companyName,
    this.licenseNumber,
    this.address,
    this.city,
    this.state,
    this.zipCode,
    this.country,
    this.website,
    this.description,
    this.logoUrl,
    required this.verificationStatus,
    this.verificationDocuments,
    required this.createdAt,
    required this.updatedAt,
  });

  factory CompanyProfile.fromJson(Map<String, dynamic> json) {
    return CompanyProfile(
      id: json['id'],
      userId: json['user_id'],
      companyName: json['company_name'],
      licenseNumber: json['license_number'],
      address: json['address'],
      city: json['city'],
      state: json['state'],
      zipCode: json['zip_code'],
      country: json['country'],
      website: json['website'],
      description: json['description'],
      logoUrl: json['logo_url'],
      verificationStatus: json['verification_status'],
      verificationDocuments: json['verification_documents'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'company_name': companyName,
      'license_number': licenseNumber,
      'address': address,
      'city': city,
      'state': state,
      'zip_code': zipCode,
      'country': country,
      'website': website,
      'description': description,
      'logo_url': logoUrl,
      'verification_status': verificationStatus,
      'verification_documents': verificationDocuments,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  bool get isVerified => verificationStatus == 'verified';
  bool get isPending => verificationStatus == 'pending';
  bool get isRejected => verificationStatus == 'rejected';
}

class GuardProfile {
  final String id;
  final String userId;
  final DateTime? dateOfBirth;
  final String? gender;
  final String? address;
  final String? city;
  final String? state;
  final String? zipCode;
  final String? country;
  final int experienceYears;
  final double hourlyRate;
  final bool availability;
  final bool isArmed;
  final String? licenseNumber;
  final DateTime? licenseExpiry;
  final List<dynamic>? certificates;
  final List<dynamic>? skills;
  final List<dynamic>? languages;
  final String? profilePicture;
  final String verificationStatus;
  final Map<String, dynamic>? verificationDocuments;
  final double rating;
  final int totalRatings;
  final DateTime createdAt;
  final DateTime updatedAt;

  GuardProfile({
    required this.id,
    required this.userId,
    this.dateOfBirth,
    this.gender,
    this.address,
    this.city,
    this.state,
    this.zipCode,
    this.country,
    required this.experienceYears,
    required this.hourlyRate,
    required this.availability,
    required this.isArmed,
    this.licenseNumber,
    this.licenseExpiry,
    this.certificates,
    this.skills,
    this.languages,
    this.profilePicture,
    required this.verificationStatus,
    this.verificationDocuments,
    required this.rating,
    required this.totalRatings,
    required this.createdAt,
    required this.updatedAt,
  });

  factory GuardProfile.fromJson(Map<String, dynamic> json) {
    return GuardProfile(
      id: json['id'],
      userId: json['user_id'],
      dateOfBirth: json['date_of_birth'] != null 
          ? DateTime.parse(json['date_of_birth']) 
          : null,
      gender: json['gender'],
      address: json['address'],
      city: json['city'],
      state: json['state'],
      zipCode: json['zip_code'],
      country: json['country'],
      experienceYears: json['experience_years'] ?? 0,
      hourlyRate: (json['hourly_rate'] ?? 0.0).toDouble(),
      availability: json['availability'] ?? true,
      isArmed: json['is_armed'] ?? false,
      licenseNumber: json['license_number'],
      licenseExpiry: json['license_expiry'] != null 
          ? DateTime.parse(json['license_expiry']) 
          : null,
      certificates: json['certificates'],
      skills: json['skills'],
      languages: json['languages'],
      profilePicture: json['profile_picture'],
      verificationStatus: json['verification_status'],
      verificationDocuments: json['verification_documents'],
      rating: (json['rating'] ?? 0.0).toDouble(),
      totalRatings: json['total_ratings'] ?? 0,
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'date_of_birth': dateOfBirth?.toIso8601String(),
      'gender': gender,
      'address': address,
      'city': city,
      'state': state,
      'zip_code': zipCode,
      'country': country,
      'experience_years': experienceYears,
      'hourly_rate': hourlyRate,
      'availability': availability,
      'is_armed': isArmed,
      'license_number': licenseNumber,
      'license_expiry': licenseExpiry?.toIso8601String(),
      'certificates': certificates,
      'skills': skills,
      'languages': languages,
      'profile_picture': profilePicture,
      'verification_status': verificationStatus,
      'verification_documents': verificationDocuments,
      'rating': rating,
      'total_ratings': totalRatings,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  bool get isVerified => verificationStatus == 'verified';
  bool get isPending => verificationStatus == 'pending';
  bool get isRejected => verificationStatus == 'rejected';
  bool get isAvailable => availability;
  bool get hasValidLicense => 
      licenseExpiry != null && licenseExpiry!.isAfter(DateTime.now());
}