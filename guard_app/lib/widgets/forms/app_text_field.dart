import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';

enum AppTextFieldType {
  text,
  email,
  password,
  phone,
  number,
  multiline,
  search,
}

class AppTextField extends StatefulWidget {
  final String? label;
  final String? hint;
  final String? helperText;
  final String? errorText;
  final AppTextFieldType type;
  final TextEditingController? controller;
  final String? initialValue;
  final bool enabled;
  final bool readOnly;
  final bool obscureText;
  final int? maxLines;
  final int? minLines;
  final int? maxLength;
  final TextInputAction? textInputAction;
  final TextCapitalization textCapitalization;
  final List<TextInputFormatter>? inputFormatters;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final VoidCallback? onTap;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final FormFieldValidator<String>? validator;
  final FocusNode? focusNode;
  final bool autofocus;
  final EdgeInsets? contentPadding;
  final double? borderRadius;
  final Color? fillColor;
  final bool filled;
  final bool isRequired;

  const AppTextField({
    super.key,
    this.label,
    this.hint,
    this.helperText,
    this.errorText,
    this.type = AppTextFieldType.text,
    this.controller,
    this.initialValue,
    this.enabled = true,
    this.readOnly = false,
    this.obscureText = false,
    this.maxLines = 1,
    this.minLines,
    this.maxLength,
    this.textInputAction,
    this.textCapitalization = TextCapitalization.none,
    this.inputFormatters,
    this.prefixIcon,
    this.suffixIcon,
    this.onTap,
    this.onChanged,
    this.onSubmitted,
    this.validator,
    this.focusNode,
    this.autofocus = false,
    this.contentPadding,
    this.borderRadius,
    this.fillColor,
    this.filled = true,
    this.isRequired = false,
  });

  @override
  State<AppTextField> createState() => _AppTextFieldState();
}

class _AppTextFieldState extends State<AppTextField> {
  late bool _obscureText;
  late TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _obscureText = widget.obscureText;
    _controller = widget.controller ?? TextEditingController(text: widget.initialValue);
  }

  @override
  void dispose() {
    if (widget.controller == null) {
      _controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.label != null) ...[
          Row(
            children: [
              Text(
                widget.label!,
                style: AppTextStyles.labelMedium,
              ),
              if (widget.isRequired)
                Text(
                  ' *',
                  style: AppTextStyles.labelMedium.copyWith(color: AppColors.error),
                ),
            ],
          ),
          const SizedBox(height: 8),
        ],
        TextFormField(
          controller: _controller,
          focusNode: widget.focusNode,
          enabled: widget.enabled,
          readOnly: widget.readOnly,
          obscureText: _obscureText,
          maxLines: widget.maxLines,
          minLines: widget.minLines,
          maxLength: widget.maxLength,
          textInputAction: widget.textInputAction ?? _getTextInputAction(),
          textCapitalization: widget.textCapitalization,
          inputFormatters: widget.inputFormatters ?? _getInputFormatters(),
          keyboardType: _getKeyboardType(),
          autofocus: widget.autofocus,
          onTap: widget.onTap,
          onChanged: widget.onChanged,
          onFieldSubmitted: widget.onSubmitted,
          validator: widget.validator,
          style: AppTextStyles.bodyMedium,
          decoration: InputDecoration(
            hintText: widget.hint,
            helperText: widget.helperText,
            errorText: widget.errorText,
            prefixIcon: widget.prefixIcon,
            suffixIcon: _buildSuffixIcon(),
            contentPadding: widget.contentPadding ?? const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 12,
            ),
            filled: widget.filled,
            fillColor: widget.fillColor ?? AppColors.surface,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(widget.borderRadius ?? 8),
              borderSide: const BorderSide(color: AppColors.border),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(widget.borderRadius ?? 8),
              borderSide: const BorderSide(color: AppColors.border),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(widget.borderRadius ?? 8),
              borderSide: const BorderSide(color: AppColors.primary, width: 2),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(widget.borderRadius ?? 8),
              borderSide: const BorderSide(color: AppColors.error),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(widget.borderRadius ?? 8),
              borderSide: const BorderSide(color: AppColors.error, width: 2),
            ),
            disabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(widget.borderRadius ?? 8),
              borderSide: const BorderSide(color: AppColors.borderLight),
            ),
            hintStyle: AppTextStyles.hintText,
            helperStyle: AppTextStyles.caption,
            errorStyle: AppTextStyles.errorText,
            counterStyle: AppTextStyles.caption,
          ),
        ),
      ],
    );
  }

  Widget? _buildSuffixIcon() {
    if (widget.type == AppTextFieldType.password) {
      return IconButton(
        icon: Icon(
          _obscureText ? Icons.visibility : Icons.visibility_off,
          color: AppColors.textSecondary,
        ),
        onPressed: () {
          setState(() {
            _obscureText = !_obscureText;
          });
        },
      );
    }
    
    if (widget.type == AppTextFieldType.search) {
      return Icon(
        Icons.search,
        color: AppColors.textSecondary,
      );
    }
    
    return widget.suffixIcon;
  }

  TextInputAction _getTextInputAction() {
    switch (widget.type) {
      case AppTextFieldType.multiline:
        return TextInputAction.newline;
      case AppTextFieldType.search:
        return TextInputAction.search;
      case AppTextFieldType.email:
        return TextInputAction.next;
      case AppTextFieldType.password:
        return TextInputAction.done;
      default:
        return TextInputAction.next;
    }
  }

  TextInputType _getKeyboardType() {
    switch (widget.type) {
      case AppTextFieldType.email:
        return TextInputType.emailAddress;
      case AppTextFieldType.phone:
        return TextInputType.phone;
      case AppTextFieldType.number:
        return TextInputType.number;
      case AppTextFieldType.multiline:
        return TextInputType.multiline;
      default:
        return TextInputType.text;
    }
  }

  List<TextInputFormatter> _getInputFormatters() {
    switch (widget.type) {
      case AppTextFieldType.phone:
        return [
          FilteringTextInputFormatter.digitsOnly,
          LengthLimitingTextInputFormatter(15),
        ];
      case AppTextFieldType.number:
        return [
          FilteringTextInputFormatter.allow(RegExp(r'[0-9.]')),
        ];
      default:
        return [];
    }
  }
}

// Convenience constructors
class AppEmailField extends AppTextField {
  const AppEmailField({
    super.key,
    super.label,
    super.hint,
    super.helperText,
    super.errorText,
    super.controller,
    super.initialValue,
    super.enabled,
    super.readOnly,
    super.textInputAction,
    super.suffixIcon,
    super.onTap,
    super.onChanged,
    super.onSubmitted,
    super.validator,
    super.focusNode,
    super.autofocus,
    super.contentPadding,
    super.borderRadius,
    super.fillColor,
    super.filled,
    super.isRequired,
  }) : super(
          type: AppTextFieldType.email,
          prefixIcon: const Icon(Icons.email_outlined),
        );
}

class AppPasswordField extends AppTextField {
  const AppPasswordField({
    super.key,
    super.label,
    super.hint,
    super.helperText,
    super.errorText,
    super.controller,
    super.initialValue,
    super.enabled,
    super.readOnly,
    super.textInputAction,
    super.suffixIcon,
    super.onTap,
    super.onChanged,
    super.onSubmitted,
    super.validator,
    super.focusNode,
    super.autofocus,
    super.contentPadding,
    super.borderRadius,
    super.fillColor,
    super.filled,
    super.isRequired,
  }) : super(
          type: AppTextFieldType.password,
          prefixIcon: const Icon(Icons.lock_outline),
        );
}

class AppPhoneField extends AppTextField {
  const AppPhoneField({
    super.key,
    super.label,
    super.hint,
    super.helperText,
    super.errorText,
    super.controller,
    super.initialValue,
    super.enabled,
    super.readOnly,
    super.textInputAction,
    super.suffixIcon,
    super.onTap,
    super.onChanged,
    super.onSubmitted,
    super.validator,
    super.focusNode,
    super.autofocus,
    super.contentPadding,
    super.borderRadius,
    super.fillColor,
    super.filled,
    super.isRequired,
  }) : super(
          type: AppTextFieldType.phone,
          prefixIcon: const Icon(Icons.phone_outlined),
        );
}

class AppSearchField extends AppTextField {
  const AppSearchField({
    super.key,
    super.label,
    super.helperText,
    super.errorText,
    super.controller,
    super.initialValue,
    super.enabled,
    super.readOnly,
    super.textInputAction,
    super.prefixIcon,
    super.suffixIcon,
    super.onTap,
    super.onChanged,
    super.onSubmitted,
    super.validator,
    super.focusNode,
    super.autofocus,
    super.contentPadding,
    super.borderRadius,
    super.fillColor,
    super.filled,
    super.isRequired,
  }) : super(
          type: AppTextFieldType.search,
          hint: 'Search...',
        );
}