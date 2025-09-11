// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'app_state.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;
/// @nodoc
mixin _$AppState {

 bool get isLoading; bool get isInitialized; String? get error; int get currentBottomNavIndex; bool get isDarkMode;
/// Create a copy of AppState
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AppStateCopyWith<AppState> get copyWith => _$AppStateCopyWithImpl<AppState>(this as AppState, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AppState&&(identical(other.isLoading, isLoading) || other.isLoading == isLoading)&&(identical(other.isInitialized, isInitialized) || other.isInitialized == isInitialized)&&(identical(other.error, error) || other.error == error)&&(identical(other.currentBottomNavIndex, currentBottomNavIndex) || other.currentBottomNavIndex == currentBottomNavIndex)&&(identical(other.isDarkMode, isDarkMode) || other.isDarkMode == isDarkMode));
}


@override
int get hashCode => Object.hash(runtimeType,isLoading,isInitialized,error,currentBottomNavIndex,isDarkMode);

@override
String toString() {
  return 'AppState(isLoading: $isLoading, isInitialized: $isInitialized, error: $error, currentBottomNavIndex: $currentBottomNavIndex, isDarkMode: $isDarkMode)';
}


}

/// @nodoc
abstract mixin class $AppStateCopyWith<$Res>  {
  factory $AppStateCopyWith(AppState value, $Res Function(AppState) _then) = _$AppStateCopyWithImpl;
@useResult
$Res call({
 bool isLoading, bool isInitialized, String? error, int currentBottomNavIndex, bool isDarkMode
});




}
/// @nodoc
class _$AppStateCopyWithImpl<$Res>
    implements $AppStateCopyWith<$Res> {
  _$AppStateCopyWithImpl(this._self, this._then);

  final AppState _self;
  final $Res Function(AppState) _then;

/// Create a copy of AppState
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? isLoading = null,Object? isInitialized = null,Object? error = freezed,Object? currentBottomNavIndex = null,Object? isDarkMode = null,}) {
  return _then(_self.copyWith(
isLoading: null == isLoading ? _self.isLoading : isLoading // ignore: cast_nullable_to_non_nullable
as bool,isInitialized: null == isInitialized ? _self.isInitialized : isInitialized // ignore: cast_nullable_to_non_nullable
as bool,error: freezed == error ? _self.error : error // ignore: cast_nullable_to_non_nullable
as String?,currentBottomNavIndex: null == currentBottomNavIndex ? _self.currentBottomNavIndex : currentBottomNavIndex // ignore: cast_nullable_to_non_nullable
as int,isDarkMode: null == isDarkMode ? _self.isDarkMode : isDarkMode // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}

}


/// Adds pattern-matching-related methods to [AppState].
extension AppStatePatterns on AppState {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AppState value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AppState() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AppState value)  $default,){
final _that = this;
switch (_that) {
case _AppState():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AppState value)?  $default,){
final _that = this;
switch (_that) {
case _AppState() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( bool isLoading,  bool isInitialized,  String? error,  int currentBottomNavIndex,  bool isDarkMode)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AppState() when $default != null:
return $default(_that.isLoading,_that.isInitialized,_that.error,_that.currentBottomNavIndex,_that.isDarkMode);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( bool isLoading,  bool isInitialized,  String? error,  int currentBottomNavIndex,  bool isDarkMode)  $default,) {final _that = this;
switch (_that) {
case _AppState():
return $default(_that.isLoading,_that.isInitialized,_that.error,_that.currentBottomNavIndex,_that.isDarkMode);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( bool isLoading,  bool isInitialized,  String? error,  int currentBottomNavIndex,  bool isDarkMode)?  $default,) {final _that = this;
switch (_that) {
case _AppState() when $default != null:
return $default(_that.isLoading,_that.isInitialized,_that.error,_that.currentBottomNavIndex,_that.isDarkMode);case _:
  return null;

}
}

}

/// @nodoc


class _AppState implements AppState {
  const _AppState({this.isLoading = false, this.isInitialized = false, this.error, this.currentBottomNavIndex = 0, this.isDarkMode = false});
  

@override@JsonKey() final  bool isLoading;
@override@JsonKey() final  bool isInitialized;
@override final  String? error;
@override@JsonKey() final  int currentBottomNavIndex;
@override@JsonKey() final  bool isDarkMode;

/// Create a copy of AppState
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AppStateCopyWith<_AppState> get copyWith => __$AppStateCopyWithImpl<_AppState>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _AppState&&(identical(other.isLoading, isLoading) || other.isLoading == isLoading)&&(identical(other.isInitialized, isInitialized) || other.isInitialized == isInitialized)&&(identical(other.error, error) || other.error == error)&&(identical(other.currentBottomNavIndex, currentBottomNavIndex) || other.currentBottomNavIndex == currentBottomNavIndex)&&(identical(other.isDarkMode, isDarkMode) || other.isDarkMode == isDarkMode));
}


@override
int get hashCode => Object.hash(runtimeType,isLoading,isInitialized,error,currentBottomNavIndex,isDarkMode);

@override
String toString() {
  return 'AppState(isLoading: $isLoading, isInitialized: $isInitialized, error: $error, currentBottomNavIndex: $currentBottomNavIndex, isDarkMode: $isDarkMode)';
}


}

/// @nodoc
abstract mixin class _$AppStateCopyWith<$Res> implements $AppStateCopyWith<$Res> {
  factory _$AppStateCopyWith(_AppState value, $Res Function(_AppState) _then) = __$AppStateCopyWithImpl;
@override @useResult
$Res call({
 bool isLoading, bool isInitialized, String? error, int currentBottomNavIndex, bool isDarkMode
});




}
/// @nodoc
class __$AppStateCopyWithImpl<$Res>
    implements _$AppStateCopyWith<$Res> {
  __$AppStateCopyWithImpl(this._self, this._then);

  final _AppState _self;
  final $Res Function(_AppState) _then;

/// Create a copy of AppState
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? isLoading = null,Object? isInitialized = null,Object? error = freezed,Object? currentBottomNavIndex = null,Object? isDarkMode = null,}) {
  return _then(_AppState(
isLoading: null == isLoading ? _self.isLoading : isLoading // ignore: cast_nullable_to_non_nullable
as bool,isInitialized: null == isInitialized ? _self.isInitialized : isInitialized // ignore: cast_nullable_to_non_nullable
as bool,error: freezed == error ? _self.error : error // ignore: cast_nullable_to_non_nullable
as String?,currentBottomNavIndex: null == currentBottomNavIndex ? _self.currentBottomNavIndex : currentBottomNavIndex // ignore: cast_nullable_to_non_nullable
as int,isDarkMode: null == isDarkMode ? _self.isDarkMode : isDarkMode // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}


}

/// @nodoc
mixin _$LoadingState {

 bool get isLoading; String? get message;
/// Create a copy of LoadingState
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$LoadingStateCopyWith<LoadingState> get copyWith => _$LoadingStateCopyWithImpl<LoadingState>(this as LoadingState, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is LoadingState&&(identical(other.isLoading, isLoading) || other.isLoading == isLoading)&&(identical(other.message, message) || other.message == message));
}


@override
int get hashCode => Object.hash(runtimeType,isLoading,message);

@override
String toString() {
  return 'LoadingState(isLoading: $isLoading, message: $message)';
}


}

/// @nodoc
abstract mixin class $LoadingStateCopyWith<$Res>  {
  factory $LoadingStateCopyWith(LoadingState value, $Res Function(LoadingState) _then) = _$LoadingStateCopyWithImpl;
@useResult
$Res call({
 bool isLoading, String? message
});




}
/// @nodoc
class _$LoadingStateCopyWithImpl<$Res>
    implements $LoadingStateCopyWith<$Res> {
  _$LoadingStateCopyWithImpl(this._self, this._then);

  final LoadingState _self;
  final $Res Function(LoadingState) _then;

/// Create a copy of LoadingState
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? isLoading = null,Object? message = freezed,}) {
  return _then(_self.copyWith(
isLoading: null == isLoading ? _self.isLoading : isLoading // ignore: cast_nullable_to_non_nullable
as bool,message: freezed == message ? _self.message : message // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [LoadingState].
extension LoadingStatePatterns on LoadingState {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _LoadingState value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _LoadingState() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _LoadingState value)  $default,){
final _that = this;
switch (_that) {
case _LoadingState():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _LoadingState value)?  $default,){
final _that = this;
switch (_that) {
case _LoadingState() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( bool isLoading,  String? message)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _LoadingState() when $default != null:
return $default(_that.isLoading,_that.message);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( bool isLoading,  String? message)  $default,) {final _that = this;
switch (_that) {
case _LoadingState():
return $default(_that.isLoading,_that.message);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( bool isLoading,  String? message)?  $default,) {final _that = this;
switch (_that) {
case _LoadingState() when $default != null:
return $default(_that.isLoading,_that.message);case _:
  return null;

}
}

}

/// @nodoc


class _LoadingState implements LoadingState {
  const _LoadingState({this.isLoading = false, this.message});
  

@override@JsonKey() final  bool isLoading;
@override final  String? message;

/// Create a copy of LoadingState
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$LoadingStateCopyWith<_LoadingState> get copyWith => __$LoadingStateCopyWithImpl<_LoadingState>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _LoadingState&&(identical(other.isLoading, isLoading) || other.isLoading == isLoading)&&(identical(other.message, message) || other.message == message));
}


@override
int get hashCode => Object.hash(runtimeType,isLoading,message);

@override
String toString() {
  return 'LoadingState(isLoading: $isLoading, message: $message)';
}


}

/// @nodoc
abstract mixin class _$LoadingStateCopyWith<$Res> implements $LoadingStateCopyWith<$Res> {
  factory _$LoadingStateCopyWith(_LoadingState value, $Res Function(_LoadingState) _then) = __$LoadingStateCopyWithImpl;
@override @useResult
$Res call({
 bool isLoading, String? message
});




}
/// @nodoc
class __$LoadingStateCopyWithImpl<$Res>
    implements _$LoadingStateCopyWith<$Res> {
  __$LoadingStateCopyWithImpl(this._self, this._then);

  final _LoadingState _self;
  final $Res Function(_LoadingState) _then;

/// Create a copy of LoadingState
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? isLoading = null,Object? message = freezed,}) {
  return _then(_LoadingState(
isLoading: null == isLoading ? _self.isLoading : isLoading // ignore: cast_nullable_to_non_nullable
as bool,message: freezed == message ? _self.message : message // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
