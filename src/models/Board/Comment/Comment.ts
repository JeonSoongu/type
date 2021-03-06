import * as express from "express";
import CommentStorage from "./CommentStorage";
import Error from "../../../utils/Error";
import { RowDataPacket } from "mysql2";

interface response {
  success: boolean;
  msg: string;
  deletedCommentNum?: number;
  deletedReplyNum?: number;
  findBuyer?: buyer;
  createdComments?: comment;
  createdReply?: comment;
  updatedComment? : updatedComment | undefined;
  updatedReply? : updatedComment | undefined;
  isDelete? : number;
}

interface updatedComment {
  depth: number;
}

interface buyer {
  nickname: string;
}

interface comment {
    studentId: string;
    studentName: string;
    nickname: string;
    num: number;
    content: string;
    groupNum: number;
    depth: number;
    replyFlag: number;
    hiddenFlag: number;
    inDate: string;
    updateDate: string;
}

interface error {
  isError: boolean;
  errMsg: string;
  clientMsg: string;
}

class Comment {
  body: any;
  params: any;
  query: any;

  constructor(readonly req : express.Request) {
    this.body = req.body;
    this.params = req.params;
  }

  async createByBoardNum() : Promise<response | error> {
    const body = this.body;
    const boardNum : number = this.params.num;

    try {
      const { isCreate, num } = await CommentStorage.createByBoardNum(
        body,
        boardNum
      );

      if (isCreate) {
        const comments : RowDataPacket[] = await CommentStorage.findOneByNum(num);
        const comment : comment[] = Object.values(
          JSON.parse(JSON.stringify(comments))
        );
        const createdComments : comment = comment[0];

        const isUpdate = await CommentStorage.updateGroupNum(createdComments.num);

        if (isUpdate) {
          createdComments.groupNum = createdComments.num;
          return { success: true, msg: "댓글 생성 성공", createdComments };
        }
        return {
          success: false,
          msg:
            "댓글 Group Number 업데이트 실패. 서버 개발자에게 문의 바랍니다.",
        };
      }
      return { success: false, msg: "댓글 생성 실패" };
    } catch (err) {
      return Error.ctrl("서버 에러입니다. 서버 개발자에게 문의해주세요.", err);
    }
  }

  async createReplyByGroupNum() : Promise<response | error> {
    const body : any = this.body;
    const boardNum : number = this.params.num;
    const groupNum : number = this.params.groupNum;

    try {
      const { isCreate, num } = await CommentStorage.createReplyByGroupNum(
        body,
        boardNum,
        groupNum
      );
      if (isCreate) {
        const isUpdateReplyFlag = await CommentStorage.updateReplyFlagOfCommentByGroupNum(
          groupNum
        );

        if (isUpdateReplyFlag) {
          const replies = await CommentStorage.findOneByNum(num);
          const reply: comment[] = Object.values(
            JSON.parse(JSON.stringify(replies))
          );
          const createdReply : comment = reply[0];
          return { success: true, msg: "답글 생성 성공", createdReply };
        }
      }
      return { success: false, msg: "답글 생성 실패" };
    } catch (err) {
      return Error.ctrl("서버 에러입니다. 서버 개발자에게 문의해주세요.", err);
    }
  }

  async updateByNum() : Promise<response | error> {
    const commentNum = this.params.commentNum;
    const body = this.body;
    try {
      const isUpdate : number = await CommentStorage.updateByNum(body, commentNum);

      if (isUpdate === 1) {
        const comments = await CommentStorage.findOneByNum(commentNum);
        const comment : comment[] = Object.values(
          JSON.parse(JSON.stringify(comments))
        );
        const updatedComment : comment = comment[0];

        return {
          success: true,
          msg: "댓글 수정 성공",
          updatedComment: updatedComment.depth ? undefined : updatedComment, // depth가 1이면 답글이므로 undefined를 반환하여 해당 키가 응답되지 않도록 한다.
          updatedReply: updatedComment.depth ? updatedComment : undefined, // depth가 0이면 댓글이므로 undefined를 반환하여 해당 키가 응답되지 않도록 한다.
        };
      }
      return {
        success: false,
        msg:
          "댓글을 수정한 studentId와 수정될 commentNum이 올바른지 확인하십시오.",
      };
    } catch (err) {
      return Error.ctrl("서버 에러입니다. 서버 개발자에게 문의해주세요.", err);
    }
  }

  async deleteCommentByNum() : Promise<response | error>  {
    const num : number = this.params.commentNum;
    try {
      const replyFlag = await CommentStorage.findReplyFlag(num);
      let isDelete : number = 0;

      if (replyFlag === 1) {
        // 답글이 있으면 숨김 처리
        const isUpdateHidden : boolean = await CommentStorage.updatehiddenFlag(num);
        if (isUpdateHidden) {
          return {
            success: true,
            msg: "댓글 숨김 처리",
            deletedCommentNum: num,
          };
        }
      } else {
        // 답글이 없으면 삭제
        isDelete = await CommentStorage.deleteCommentByNum(num);
      }

      if (isDelete === 1) {
        return {
          success: true,
          msg: "댓글 삭제 성공",
          deletedCommentNum: num,
        };
      }
      return {
        success: false,
        msg:
          "답글을 삭제하려면 depth가 1이어야 합니다. 댓글을 삭제하려는 것이 맞다면 댓글 번호가 올바른지 확인해 주십시오.",
      };
    } catch (err) {
      return Error.ctrl("서버 에러입니다. 서버 개발자에게 문의해주세요.", err);
    }
  }

  async deleteReplyByNum() : Promise<response | error> {
    const num : number = this.params.commentNum;
    const studentId : string = this.body.studentId;

    const groupNum : number = await CommentStorage.findOneGroupNum(num);
    try {
      const isDelete : number = await CommentStorage.deleteReplyByNum(num, studentId);
      const replyFlag : number = await CommentStorage.updateReplyFlag(groupNum);
      if (replyFlag === 1) {
        const hiddenFlag : number = await CommentStorage.findOneHiddenFlag(groupNum);
        if (hiddenFlag === 1) {
          const isDeleteHidden : boolean = await CommentStorage.deleteHiddenComment(
            groupNum
          );
          if (isDeleteHidden) {
            return {
              success: true,
              msg: "답글 삭제 및 숨김 댓글 삭제",
              deletedCommentNum: groupNum, // 숨김 처리 되어있던 댓글이 삭제됨. 따라서 함께 응답하여 클라이언트에서 해당 메인 댓글을 UI에서 제거할 수 있도록 한다.
              deletedReplyNum: num, // 삭제된 답글의 정보도 응답한다.
            };
          }
        }
      }
      if (isDelete === 1) {
        return {
          success: true,
          msg: "답글 삭제 성공",
          deletedReplyNum: num,
        };
      }
      return {
        success: false,
        msg:
          "댓글을 삭제하려면 depth가 0이어야 합니다. 답글을 삭제하려는 것이 맞다면 답글 번호가 올바른지 확인해 주십시오.",
      };
    } catch (err) {
      return Error.ctrl("서버 에러입니다. 서버 개발자에게 문의해주세요.", err);
    }
  }

  async findStudentIdByNum() : Promise<response | error> {
    const boardNum : number = this.params.num;
    try {
      const buyers : RowDataPacket[] = await CommentStorage.findStudentIdByNum(boardNum);
      const buyer : buyer[] = Object.values(
        JSON.parse(JSON.stringify(buyers))
      );
      const findBuyer : buyer = buyer[0];

      return { success: true, msg: "comments조회 완료 되었습니다.", findBuyer };
    } catch (err) {
      return Error.ctrl("서버 에러입니다. 서버 개발자에게 문의해주세요.", err);
    }
  }
}

export default Comment;
