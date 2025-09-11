/// Base model class with common functionality
abstract class BaseModel {
  String get id;
  DateTime get createdAt;
  DateTime get updatedAt;
  
  Map<String, dynamic> toJson();
  
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is BaseModel && other.id == id;
  }
  
  @override
  int get hashCode => id.hashCode;
}