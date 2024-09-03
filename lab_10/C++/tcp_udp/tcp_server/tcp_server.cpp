#include <iostream>
#include <clocale>
#include <ctime>

#include "ErrorMsgText.h"
#include "Winsock2.h"
using namespace std;
#pragma comment(lib, "WS2_32.lib")

int main()
{
    setlocale(0, "ru");

    WSADATA wsa_data;

    SOCKADDR_IN serv;
    serv.sin_family = AF_INET;
    serv.sin_port = htons(3000);
    serv.sin_addr.s_addr = INADDR_ANY;

    try
    {
        SOCKET sock;
        if (WSAStartup(MAKEWORD(2, 0), &wsa_data) != 0)
        {
            throw SetErrorMsgText("Startup: ", WSAGetLastError());
        }

        if ((sock = socket(AF_INET, SOCK_STREAM, NULL)) == INVALID_SOCKET)
        {
            throw SetErrorMsgText("socket: ", WSAGetLastError());
        }

        if (bind(sock, LPSOCKADDR(&serv), sizeof(serv)) == SOCKET_ERROR)
        {
            throw SetErrorMsgText("bind: ", WSAGetLastError());
        }

        if (listen(sock, SOMAXCONN) == SOCKET_ERROR)
        {
            throw SetErrorMsgText("listen: ", WSAGetLastError());
        }

        SOCKET cS;
        SOCKADDR_IN clnt;
        memset(&clnt, 0, sizeof(clnt));
        int lclnt = sizeof(clnt);

        clock_t start, end;
        char ibuf[12];
        int libuf = 0, lobuf = 0;
        bool flag = true;

        while (true)
        {
            if ((cS = accept(sock, (sockaddr*)&clnt, &lclnt)) == INVALID_SOCKET)
                throw SetErrorMsgText("accept: ", WSAGetLastError());

            while (true)
            {
                if ((libuf = recv(cS, ibuf, sizeof(ibuf), NULL)) == SOCKET_ERROR)
                    throw SetErrorMsgText("recv: ", WSAGetLastError());

                ibuf[libuf] = '\0';  // Добавляем завершающий символ нуля в конец строки

                if (strcmp(ibuf, "") == 0)
                {
                    break;
                }

                string obuf = "ECHO: " + static_cast<string>(ibuf).substr(0, libuf);
                cout << obuf << endl;

                if ((lobuf = send(cS, obuf.c_str(), strlen(obuf.c_str()) + 1, NULL)) == SOCKET_ERROR)
                    throw SetErrorMsgText("send: ", WSAGetLastError());

                if (strcmp(ibuf, "") == 0)
                {
                    break;
                }
            }
        }
    }
    catch (string errorMsgText)
    {
        WSACleanup();
    }

    system("pause");
    return 0;
}
