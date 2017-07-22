import express from 'express';

const ideasRouter = express.Router();

/******* 아이디어 *******/
// 아이디어 추가
ideasRouter.post('/', (req, res) => {
  const { contents } = req.body;
  const userId = req.app.get('user_id');

  req.app.get('pool').query(
    `INSERT INTO idea (contents, user_id) VALUES("${contents}", ${userId});`,
    (error, results, fields) => {
      if (error) {
        console.log(error.stack);
      }
      res.json(results);
    }
  );
});

// 아이디어 수정
ideasRouter.put('/:idea_id', (req, res) => {
  const { contents } = req.body;
  const ideaId = req.params.idea_id;
  const userId = req.app.get('user_id');

  req.app.get('pool').query(
    `update idea set contents="${contents}" where id=${ideaId};`,
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ msg: 'FAIL' });
        console.log(error.stack);
      }
      res.status(200).json(results);
    }
  );
});

// 아이디어 삭제
ideasRouter.delete('/:idea_id', (req, res) => {
  const ideaId = req.params.idea_id;
  const userId = req.app.get('user_id');

  req.app.get('pool').query(
    `delete from idea where id=${ideaId};`,
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ msg: 'FAIL' });
        console.log(error.stack);
      }
      res.status(200).json(results);
    }
  );
});

// 아이디어 리스트 조회
ideasRouter.get('/', (req, res) => {
  const userId = req.app.get('user_id');

  req.app.get('pool').query(
    `select * from idea;`,
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ msg: 'FAIL' });
        console.log(error.stack);
      }
      res.status(200).json(results);
    }
  );
});

// 아이디어 상세 조회
ideasRouter.get('/:id', (req, res) => {
  const userId = req.app.get('user_id');

  req.app.get('pool').query(
    `select * from idea where id=${req.params.id};`,
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ msg: 'FAIL' });
        console.log(error.stack);
      }
      res.status(200).json(results[0]);
    }
  );
});

/******* 아이디어 댓글 *******/
// 아이디어 댓글 추가
ideasRouter.post('/:id/comments', (req, res) => {
  const userId = req.app.get('user_id');

  const { contents, user_id, idea_id } = req.body;
  req.app.get('pool').query(
    `INSERT INTO idea_comment (contents, user_id, idea_id) VALUES("${contents}", ${user_id}, ${idea_id});`,
    (err, results, fields) => {
      if (err) {
        res.status(400).json({});
        console.log(err.stack);
      }
      res.status(200).json(results);
    }
  );
});

// 아이디어 댓글 수정
ideasRouter.put('/:idea_id/comments/:comment_id', (req, res) => {
  const ideaId = req.params.idea_id;
  const commentId = req.params.comment_id;
  const { contents } = req.body;
  const userId = req.app.get('user_id');

  req.app.get('pool').req.app.get('pool').query(
    `UPDATE idea_comment SET contents = "${contents}" WHERE id = ${commentId};`,
    (err, results, fields) => {
      if (err) {
        res.status(400).json({});
        console.log(err.stack);
      }
      res.status(200).json(results);
    }
  );
});

// 아이디어 댓글 삭제
ideasRouter.delete('/:idea_id/comments/:comment_id', (req, res) => {
  const ideaId = req.params.idea_id;
  const commentId = req.params.comment_id;
  const userId = req.app.get('user_id');

  req.app.get('pool').query(
    `DELETE FROM idea_comment WHERE id = ${commentId} AND idea_id = ${ideaId};`,
    (err, results, fields) => {
      if (err) {
        res.status(400).json({});
        console.log(err.stack);
      }
      res.status(200).json({ msg: 'OK' });
    }
  );
});

// 아이디어 댓글 리스트
ideasRouter.get('/:idea_id/comments', (req, res) => {
  const ideaId = req.params.idea_id;
  const userId = req.app.get('user_id');

  req.app.get('pool').query(
    `SELECT (id, contents, user_id, created_at, updated_at FROM idea_comment WHERE idea_id = ${ideaId};`,
    (err, results, fields) => {
      if (err) {
        res.status(400).json({});
        console.log(err.stack);
      }
      res.status(200).json(results);
    }
  );
});

/******* 아이디어 공감 *******/
// 아이디어 공감 추가
ideasRouter.post('/:id/empathy', (req, res) => {
  const { idea_id } = req.body;
  const userId = req.app.get('user_id');

  req.app.get('pool').query(
    `INSERT INTO idea_empathy (user_id, idea_id) VALUES(${user_id}, ${idea_id});`,
    (err, results, fields) => {
      if (err) {
        res.status(400).json({});
        console.log(err.stack);
      }
      res.status(200).json(results);
    }
  );
});

// 아이디어 공감 삭제
ideasRouter.delete('/:id/empathy/:empathy_id', (req, res) => {
  const ideaId = req.params.id;
  const empathyId = req.params.empathy_id;
  const userId = req.app.get('user_id');

  req.app.get('pool').query(
    `DELETE FROM idea_empathy WHERE id = ${empathyId} AND idea_id = ${ideaId};`,
    (err, results, fields) => {
      if (err) {
        res.status(400).json({});
        console.log(err.stack);
      }
      res.status(200).json({ msg: 'OK' });
    }
  );
});

/******* 아이디어 참여 *******/
// 아이디어 참여 추가
ideasRouter.post('/:idea_id/join', (req, res) => {
  const { user_id } = req.body;
  const ideaId = req.params.idea_id;
  const userId = req.app.get('user_id');

  connection.query(
    `INSERT INTO idea_join (user_id, idea_id) VALUES(${user_id}, ${ideaId});`,
    (err, results, fields) => {
      if (err) {
        res.status(400).json({});
        console.log(err.stack);
      }
      res.status(200).json(results);
    }
  );
});

// 아이디어 참여 삭제
ideasRouter.delete('/:idea_id/join/:join_id', (req, res) => {
  const ideaId = req.params.idea_id;
  const joinId = req.params.join_id;
  const userId = req.app.get('user_id');

  connection.query(
    `DELETE FROM idea_join WHERE id = ${joinId} AND idea_id = ${ideaId};`,
    (err, results, fields) => {
      if (err) {
        res.status(400).json({});
        console.log(err.stack);
      }
      res.status(200).json({ msg: 'OK' });
    }
  );
});

// 아이디어 참여 리스트
ideasRouter.get('/:idea_id/join', (req, res) => {
  const ideaId = req.params.idea_id;
  const userId = req.app.get('user_id');

  connection.query(
    `SELECT (user.id, user.name) FROM idea_join INNER JOIN user ON user.id = idea_join.user_id WHERE idea_id = ${ideaId};`,
    (err, results, fields) => {
      if (err) {
        res.status(400).json({});
        console.log(err.stack);
      }
      res.status(200).json(results);
    }
  );
});

export default ideasRouter;
