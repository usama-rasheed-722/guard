import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';

enum AppButtonType {
  primary,
  secondary,
  outline,
  text,
  icon,
}

enum AppButtonSize {
  small,
  medium,
  large,
}

class AppButton extends StatelessWidget {
  final String? text;
  final IconData? icon;
  final VoidCallback? onPressed;
  final AppButtonType type;
  final AppButtonSize size;
  final bool isLoading;
  final bool isFullWidth;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final double? borderRadius;
  final EdgeInsets? padding;
  final Widget? child;

  const AppButton({
    super.key,
    this.text,
    this.icon,
    this.onPressed,
    this.type = AppButtonType.primary,
    this.size = AppButtonSize.medium,
    this.isLoading = false,
    this.isFullWidth = false,
    this.backgroundColor,
    this.foregroundColor,
    this.borderRadius,
    this.padding,
    this.child,
  });

  @override
  Widget build(BuildContext context) {
    final isDisabled = onPressed == null || isLoading;
    
    return SizedBox(
      width: isFullWidth ? double.infinity : null,
      child: _buildButton(context, isDisabled),
    );
  }

  Widget _buildButton(BuildContext context, bool isDisabled) {
    switch (type) {
      case AppButtonType.primary:
        return ElevatedButton(
          onPressed: isDisabled ? null : onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: backgroundColor ?? AppColors.primary,
            foregroundColor: foregroundColor ?? AppColors.textOnPrimary,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(borderRadius ?? 8),
            ),
            padding: padding ?? _getPadding(),
            elevation: isDisabled ? 0 : 2,
          ),
          child: _buildChild(),
        );
        
      case AppButtonType.secondary:
        return ElevatedButton(
          onPressed: isDisabled ? null : onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: backgroundColor ?? AppColors.secondary,
            foregroundColor: foregroundColor ?? AppColors.textOnSecondary,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(borderRadius ?? 8),
            ),
            padding: padding ?? _getPadding(),
            elevation: isDisabled ? 0 : 2,
          ),
          child: _buildChild(),
        );
        
      case AppButtonType.outline:
        return OutlinedButton(
          onPressed: isDisabled ? null : onPressed,
          style: OutlinedButton.styleFrom(
            foregroundColor: foregroundColor ?? AppColors.primary,
            side: BorderSide(
              color: backgroundColor ?? AppColors.primary,
              width: 1.5,
            ),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(borderRadius ?? 8),
            ),
            padding: padding ?? _getPadding(),
          ),
          child: _buildChild(),
        );
        
      case AppButtonType.text:
        return TextButton(
          onPressed: isDisabled ? null : onPressed,
          style: TextButton.styleFrom(
            foregroundColor: foregroundColor ?? AppColors.primary,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(borderRadius ?? 8),
            ),
            padding: padding ?? _getPadding(),
          ),
          child: _buildChild(),
        );
        
      case AppButtonType.icon:
        return IconButton(
          onPressed: isDisabled ? null : onPressed,
          icon: _buildChild(),
          style: IconButton.styleFrom(
            backgroundColor: backgroundColor,
            foregroundColor: foregroundColor ?? AppColors.primary,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(borderRadius ?? 8),
            ),
            padding: padding ?? _getPadding(),
          ),
        );
    }
  }

  Widget _buildChild() {
    if (child != null) return child!;
    
    if (isLoading) {
      return SizedBox(
        width: _getLoadingSize(),
        height: _getLoadingSize(),
        child: CircularProgressIndicator(
          strokeWidth: 2,
          valueColor: AlwaysStoppedAnimation<Color>(
            foregroundColor ?? AppColors.textOnPrimary,
          ),
        ),
      );
    }
    
    if (icon != null && text != null) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: _getIconSize()),
          const SizedBox(width: 8),
          Text(text!, style: _getTextStyle()),
        ],
      );
    }
    
    if (icon != null) {
      return Icon(icon, size: _getIconSize());
    }
    
    if (text != null) {
      return Text(text!, style: _getTextStyle());
    }
    
    return const SizedBox.shrink();
  }

  EdgeInsets _getPadding() {
    switch (size) {
      case AppButtonSize.small:
        return const EdgeInsets.symmetric(horizontal: 12, vertical: 8);
      case AppButtonSize.medium:
        return const EdgeInsets.symmetric(horizontal: 16, vertical: 12);
      case AppButtonSize.large:
        return const EdgeInsets.symmetric(horizontal: 24, vertical: 16);
    }
  }

  double _getLoadingSize() {
    switch (size) {
      case AppButtonSize.small:
        return 16;
      case AppButtonSize.medium:
        return 20;
      case AppButtonSize.large:
        return 24;
    }
  }

  double _getIconSize() {
    switch (size) {
      case AppButtonSize.small:
        return 16;
      case AppButtonSize.medium:
        return 20;
      case AppButtonSize.large:
        return 24;
    }
  }

  TextStyle _getTextStyle() {
    switch (size) {
      case AppButtonSize.small:
        return AppTextStyles.buttonSmall;
      case AppButtonSize.medium:
        return AppTextStyles.buttonMedium;
      case AppButtonSize.large:
        return AppTextStyles.buttonLarge;
    }
  }
}

// Convenience constructors
class AppPrimaryButton extends AppButton {
  const AppPrimaryButton({
    super.key,
    super.text,
    super.icon,
    super.onPressed,
    super.size,
    super.isLoading,
    super.isFullWidth,
    super.backgroundColor,
    super.foregroundColor,
    super.borderRadius,
    super.padding,
    super.child,
  }) : super(type: AppButtonType.primary);
}

class AppSecondaryButton extends AppButton {
  const AppSecondaryButton({
    super.key,
    super.text,
    super.icon,
    super.onPressed,
    super.size,
    super.isLoading,
    super.isFullWidth,
    super.backgroundColor,
    super.foregroundColor,
    super.borderRadius,
    super.padding,
    super.child,
  }) : super(type: AppButtonType.secondary);
}

class AppOutlineButton extends AppButton {
  const AppOutlineButton({
    super.key,
    super.text,
    super.icon,
    super.onPressed,
    super.size,
    super.isLoading,
    super.isFullWidth,
    super.backgroundColor,
    super.foregroundColor,
    super.borderRadius,
    super.padding,
    super.child,
  }) : super(type: AppButtonType.outline);
}

class AppTextButton extends AppButton {
  const AppTextButton({
    super.key,
    super.text,
    super.icon,
    super.onPressed,
    super.size,
    super.isLoading,
    super.isFullWidth,
    super.backgroundColor,
    super.foregroundColor,
    super.borderRadius,
    super.padding,
    super.child,
  }) : super(type: AppButtonType.text);
}

class AppIconButton extends AppButton {
  const AppIconButton({
    super.key,
    super.icon,
    super.onPressed,
    super.size,
    super.isLoading,
    super.isFullWidth,
    super.backgroundColor,
    super.foregroundColor,
    super.borderRadius,
    super.padding,
    super.child,
  }) : super(type: AppButtonType.icon);
}