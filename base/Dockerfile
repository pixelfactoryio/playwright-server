FROM ubuntu:20.04

# Package list from
# Source https://github.com/microsoft/playwright/blob/master/utils/docker/Dockerfile.focal

RUN apt-get -qq update \
    && apt-get -y -qq install software-properties-common \
    && apt-get -qq update \
    && apt-get -y -qq --no-install-recommends install \
    curl \
    git \
    # Install WebKit dependencies
    libwoff1 \
    libopus0 \
    libwebp6 \
    libwebpdemux2 \
    libenchant1c2a \
    libgudev-1.0-0 \
    libsecret-1-0 \
    libhyphen0 \
    libgdk-pixbuf2.0-0 \
    libegl1 \
    libnotify4 \
    libxslt1.1 \
    libevent-2.1-7 \
    libgles2 \
    libxcomposite1 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libepoxy0 \
    libgtk-3-0 \
    libharfbuzz-icu0 \
    # Install gstreamer and plugins to support video playback in WebKit.
    libgstreamer-gl1.0-0 \
    libgstreamer-plugins-bad1.0-0 \
    gstreamer1.0-plugins-good \
    gstreamer1.0-libav \
    # Install Chromium dependencies
    fonts-liberation \
    libnss3 \
    libxss1 \
    libasound2 \
    fonts-noto-color-emoji \
    libxtst6 \
    # Install Firefox dependencies
    libdbus-glib-1-2 \
    libxt6 \
    # Install ffmpeg to bring in audio and video codecs necessary for playing videos in Firefox.
    ffmpeg \
    # (Optional) Install XVFB if there's a need to run browsers in headful mode
    xvfb \
    # Install node14
    && curl --silent --location https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get -y -qq install nodejs \
    && apt-get -y -qq install build-essential \
    && npm install -g yarn

# Add the playwright user (pwuser)
RUN groupadd -r pwuser && useradd -r -g pwuser -G audio,video pwuser \
    && mkdir -p /home/pwuser/Downloads \
    && chown -R pwuser:pwuser /home/pwuser

# CleanUp
RUN apt-get -qq clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
