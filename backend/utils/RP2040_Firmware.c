/**
 * @brief RPI PICO (RP2040) Test Firmware
 * 
 * needs to be built using the official pico SDK
 *
 * cmake.. /build/
 * make /build/
 *
 * comms over USB Mini UART
 *
 * version: 0.8
*/

#include <stdio.h>
#include <string.h>
#include "pico/stdlib.h"
#include "pico/bootrom.h"

#define ENDSTDIN    255
#define CR          13
#define LED_PIN     25
#define TERMINATION '\0'

void flash_led(int n) {
    /* flash led n times */
    int a;
    
    for (a=0;a<n;a+=1) {
        gpio_put(LED_PIN, 1);
        sleep_ms(100);
        gpio_put(LED_PIN, 0);
    }
}

int main() {
    // initialize interfaces        
    stdio_init_all();

    char msg[100];      // input buff
    char chr;           // input char
    int i = 0;          // input buff pointer
    int cnt = 0;        // ping-pong session ID

    memset(msg, 0, sizeof(msg));

    gpio_init(LED_PIN);
    gpio_set_dir(LED_PIN, GPIO_OUT);

    while (1) {
        // get character if any (pops first and goes on)
        chr = getchar_timeout_us(0);
        while (chr != ENDSTDIN && chr != '\n' && chr != EOF) {
            msg[i++] = chr;
            if (chr == CR || i == (sizeof(msg) - 1)) {
                msg[i] = TERMINATION;      // termination
                flash_led(1);               // flash once on Rx
                sleep_ms(250);             // delay to discern Rx from Tx blinks

                if (strcmp(msg, "reboot\n")==0 && strcmp(msg, "REBOOT\n")==0) {
                    // flash LED 3 times before full reboot
                    flash_led(3);
                    reset_usb_boot(0,0);
                } else {
                    sleep_ms(50);
                    printf("ping~pong[%d]: %s\n", cnt, msg);
                    
                    // flash once on Tx
                    flash_led(1);
                    cnt+=1;
                }
                
                // reset buffer
                memset(msg, 0, sizeof(msg));
                i = 0;
                break;
            }
            chr = getchar_timeout_us(0);
        }
    } 
    cnt = 0;
    return 0;
}
