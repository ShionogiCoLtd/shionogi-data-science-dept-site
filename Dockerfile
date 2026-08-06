FROM jekyll/jekyll

WORKDIR /srv/jekyll

COPY Gemfile Gemfile.lock ./

RUN bundle install