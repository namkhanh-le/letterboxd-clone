CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, 
  created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE diary (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  movie_id INTEGER NOT NULL,
  movie_title VARCHAR(255),
  poster_path VARCHAR(255),
  watched_date DATE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  rewatch BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);


CREATE INDEX idx_diary_movie_id ON diary(movie_id);
CREATE INDEX idx_diary_user_id ON diary(user_id);