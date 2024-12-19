import { Message } from './types';

export function doGet(e: GoogleAppsScript.Events.DoGet) {
  // 現在の時刻を取得
  const now = new Date();

  // 1時間前の時刻を取得
  const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000));

  // Gmailの検索クエリを作成（after:の後にUNIXタイムスタンプを使う方法）
  const query = 'after:' + Math.floor(oneHourAgo.getTime() / 1000);

  // クエリを使ってスレッドを検索
  const threads = GmailApp.search(query);

  // 結果を出力するための配列
  const messagesData: Message[] = [];

  // スレッドごとにメールを取得
  threads.forEach(thread => {
    const messages = thread.getMessages();
    messages.forEach(message => {
      // メッセージの受信日時が1時間以内かどうかを確認
      if (message.getDate().getTime() > oneHourAgo.getTime()) {
        const messageData: Message = {
          subject: message.getSubject(),
          from: message.getFrom(),
          date: Utilities.formatDate(message.getDate(), "JST", "yyyy/MM/dd HH:mm:ssZ"),
          body: message.getPlainBody().slice(0, 10000) // 本文の先頭10000文字だけ取得
        };
        messagesData.push(messageData);
      }
    });
  });

  // 取得したメール情報をログに出力
  Logger.log(messagesData);

  // 必要に応じてスプレッドシートや通知に使用可能
  return ContentService.createTextOutput(JSON.stringify(messagesData)).setMimeType(ContentService.MimeType.JSON);
}
