# Use the official PHP-FPM image
FROM php:8.2-fpm

# Set environment variables
ENV APP_ENV=prod
ENV COMPOSER_ALLOW_SUPERUSER=1

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    libicu-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    git \
    unzip \
    && docker-php-ext-install intl mbstring opcache pdo pdo_pgsql

# Install Composer globally
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set work directory
WORKDIR /app

# Copy the application code into the container
COPY . /app

# Install Symfony dependencies without development packages
RUN composer install --no-dev --optimize-autoloader --classmap-authoritative

# Set correct permissions for Symfony folders
RUN mkdir -p /app/var/cache /app/var/log && chown -R www-data:www-data /app

# Expose port for PHP-FPM
EXPOSE 9000

# Start PHP-FPM server
CMD ["php-fpm"]