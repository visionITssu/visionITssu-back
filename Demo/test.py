import base64
import sys

from imutils import face_utils
import dlib
import cv2
import math
import torch

import numpy as np

# # print(sys.argv[1])
encoded_data = sys.argv[1]
decoded_data = base64.b64decode(encoded_data)

image_nparray = np.frombuffer(decoded_data, dtype=np.uint8)
image = cv2.imdecode(image_nparray, cv2.IMREAD_COLOR)
#image = cv2.imread(image)
print("image 생성완료")

# facial landmark predictor
# detector = dlib.get_frontal_face_detector()
# predictor = dlib.shape_predictor("/Users/byeon-eun-yeong/Desktop/visionITssu-back/Demo/shape_predictor_68_face_landmarks.dat")

# cam=cv2.VideoCapture('')

# while True:
#     #ret,frame = cam.read()
#     # gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

#     # detect faces in the grayscale frame
#     rects = detector(image, 1) #얼굴 개수

#     # number of faces on the frame
#     # if len(rects) > 0:
#     #     text = "{} face(s) found".format(len(rects))
#     #     cv2.putText(frame, text, (10, 20), cv2.FONT_HERSHEY_SIMPLEX,
#     #                 0.5, (0, 0, 255), 2)

#     # loop over the face detections
#     for rect in rects:
#         (bX, bY, bW, bH) = face_utils.rect_to_bb(rect)
#         # cv2.rectangle(frame, (bX, bY), (bX + bW, bY + bH),
#         #               (0, 255, 0), 1)

#         # determine the facial landmarks for the face region, then
#         # convert the facial landmark (x, y)-coordinates to a NumPy
#         # array
#         shape = predictor(image, rect)
#         # shape_np = face_utils.shape_to_np(shape)

#         # loop over the (x, y)-coordinates for the facial landmarks
#         # and draw each of them
#         # for (i, (x, y)) in enumerate(shape_np): #얼굴 점 찍는 부분
#         #     cv2.circle(frame, (x, y), 1, (0, 0, 255), -1)
#         #     cv2.putText(frame, str(i + 1), (x - 10, y - 10),
#         #                 cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 0, 255), 1)

#         num_of_points_out = 17 #17번까지 얼굴 하관 라인
#         num_of_points_in = shape.num_parts - num_of_points_out
#         gx_out = 0;
#         gy_out = 0;
#         gx_in = 0;
#         gy_in = 0

#         for i in range(shape.num_parts):  # 총 68개
#             shape_point = shape.part(i)
#             # print('얼굴 랜드마크 No.{} 좌표위치: ({}, {})'.format(i, shape_point.x, shape_point.y))

#             if i < num_of_points_out:  # 얼굴 라인
#                 # cv2.circle(frame, (shape_point.x, shape_point.y), circle_r, color_l_out, line_width)
#                 gx_out = gx_out + shape_point.x / num_of_points_out
#                 gy_out = gy_out + shape_point.y / num_of_points_out

#             else:  # 얼굴 기관
#                 # cv2.circle(frame, (shape_point.x, shape_point.y), circle_r, color_l_in, line_width)
#                 gx_in = gx_in + shape_point.x / num_of_points_in
#                 gy_in = gy_in + shape_point.y / num_of_points_in


#         # 얼굴 방향 계산
#         theta = math.asin(2 * (gx_in - gx_out) / (rect.right() - rect.left()))
#         radian = theta * 180 / math.pi

#         threshold = 1.5
#         result = 0
#         if radian < threshold and radian > -threshold:
#             textPrefix = 'front'
#             result = 1

#         else:
#             textPrefix = 'none'
#             result = 0

#         print('\n', result)
#         textShow = textPrefix + str(round(abs(radian), 1)) + " deg."
#         color_f = (0, 0, 255)  # face - 빨강
#         # 도형 설정
#         line_width = 2
#         circle_r = 2
#         # 글꼴 설정
#         fontType = cv2.FONT_HERSHEY_SIMPLEX
#         fontSize = 1

#         #cv2.putText(frame, textShow, (rect.left(), rect.top()), fontType, fontSize, color_f, line_width)
#     # show the frame
#     #cv2.imshow("Frame", frame)
#     key = cv2.waitKey(1) & 0xFF

#     # if the `q` key was pressed, break from the loop
#     if key == ord("q"):
#         break

# cv2.destroyAllWindows()
# cam.release()