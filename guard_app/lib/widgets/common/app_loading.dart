import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

class AppLoading extends StatelessWidget {
  final String? message;
  final Color? color;
  final double? size;
  final bool isFullScreen;

  const AppLoading({
    super.key,
    this.message,
    this.color,
    this.size,
    this.isFullScreen = false,
  });

  @override
  Widget build(BuildContext context) {
    final loadingWidget = Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(
              color ?? AppColors.primary,
            ),
            strokeWidth: 3,
          ),
          if (message != null) ...[
            const SizedBox(height: 16),
            Text(
              message!,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ],
      ),
    );

    if (isFullScreen) {
      return Scaffold(
        backgroundColor: AppColors.background.withValues(alpha: 0.8),
        body: loadingWidget,
      );
    }

    return loadingWidget;
  }
}

class AppLoadingOverlay extends StatelessWidget {
  final Widget child;
  final bool isLoading;
  final String? loadingMessage;
  final Color? loadingColor;

  const AppLoadingOverlay({
    super.key,
    required this.child,
    required this.isLoading,
    this.loadingMessage,
    this.loadingColor,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        child,
        if (isLoading)
          Container(
            color: AppColors.background.withValues(alpha: 0.8),
            child: AppLoading(
              message: loadingMessage,
              color: loadingColor,
              isFullScreen: true,
            ),
          ),
      ],
    );
  }
}

class AppShimmer extends StatefulWidget {
  final double? width;
  final double? height;
  final double? borderRadius;
  final Color? baseColor;
  final Color? highlightColor;

  const AppShimmer({
    super.key,
    this.width,
    this.height,
    this.borderRadius,
    this.baseColor,
    this.highlightColor,
  });

  @override
  State<AppShimmer> createState() => _AppShimmerState();
}

class _AppShimmerState extends State<AppShimmer>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );
    _animation = Tween<double>(begin: -1.0, end: 2.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
    _animationController.repeat();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Container(
          width: widget.width,
          height: widget.height,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(widget.borderRadius ?? 8),
            gradient: LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: [
                widget.baseColor ?? AppColors.greyLight,
                widget.highlightColor ?? AppColors.grey,
                widget.baseColor ?? AppColors.greyLight,
              ],
              stops: [
                _animation.value - 0.3,
                _animation.value,
                _animation.value + 0.3,
              ],
            ),
          ),
        );
      },
    );
  }
}

class AppShimmerList extends StatelessWidget {
  final int itemCount;
  final double? itemHeight;
  final EdgeInsets? itemPadding;

  const AppShimmerList({
    super.key,
    this.itemCount = 5,
    this.itemHeight,
    this.itemPadding,
  });

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: itemCount,
      itemBuilder: (context, index) {
        return Padding(
          padding: itemPadding ?? const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 8,
          ),
          child: AppShimmer(
            width: double.infinity,
            height: itemHeight ?? 80,
            borderRadius: 12,
          ),
        );
      },
    );
  }
}

class AppShimmerCard extends StatelessWidget {
  final double? height;
  final EdgeInsets? padding;

  const AppShimmerCard({
    super.key,
    this.height,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: padding ?? const EdgeInsets.all(8),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AppShimmer(
              width: double.infinity,
              height: 20,
              borderRadius: 4,
            ),
            const SizedBox(height: 12),
            AppShimmer(
              width: double.infinity,
              height: 16,
              borderRadius: 4,
            ),
            const SizedBox(height: 8),
            AppShimmer(
              width: 200,
              height: 16,
              borderRadius: 4,
            ),
            if (height != null) ...[
              const SizedBox(height: 16),
              AppShimmer(
                width: double.infinity,
                height: height! - 100,
                borderRadius: 8,
              ),
            ],
          ],
        ),
      ),
    );
  }
}