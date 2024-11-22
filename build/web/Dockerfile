# FROM ruby:3.2.0

# # Register Yarn package source.
# RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
# RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

# # Install additional packages.
# RUN apt update -qq
# RUN apt install -y postgresql-client nodejs yarn

# # Prepare working directory.
# WORKDIR /opt/app
# COPY ./app /opt/app
# RUN gem install bundler
# RUN bundle install

# # Configure endpoint.
# COPY ./build/web/entrypoint.sh /usr/bin/
# RUN chmod +x /usr/bin/entrypoint.sh
# ENTRYPOINT ["entrypoint.sh"]
# EXPOSE 3000

# # Start app server.
# CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]

FROM ruby:3.2.0

WORKDIR /opt/app

COPY ./app /opt/app

RUN gem install bundler && bundle install

RUN groupadd -g 1000 rails && \
    useradd -u 1000 -g 1000 -m rails && \
    chown -R rails:rails /opt/app

COPY build/web/entrypoint.sh /usr/bin/

RUN chmod +x /usr/bin/entrypoint.sh

USER rails

ENTRYPOINT ["entrypoint.sh"]

EXPOSE 3000

CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
