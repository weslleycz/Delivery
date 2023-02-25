type Props={
    color:string;
}

export const Logo = ({color}:Props) => {
    return (
        <>
            <svg
                style={{marginTop:24}}
                width="120"
                height="120"
                viewBox="0 0 1602 1672"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M708.059 518.884C647.736 496.753 576.307 406.979 532.895 298.731C515.931 256.434 521.522 173.665 544.643 124.792C567.262 66.3822 616.164 34.6735 654.19 14.1902C670.351 0.777727 761.116 -4.99995 798.188 5.18516C816.214 10.1376 843.478 21.8784 858.775 31.276L886.587 48.3624L858.775 65.0805C795.077 103.37 712.156 186.611 712.156 212.265C712.156 223.547 724.308 220.295 741.337 204.456C772.694 175.289 882.86 105.157 934.247 81.6475C1016.17 44.168 1056.6 31.3359 1109.6 25.9867C1216.54 15.1952 1230.37 52.6355 1147.69 129.1C1120.89 153.886 1085.97 181.038 1070.09 189.438C1041.57 204.527 1041 204.503 1022.72 187.476C1012.55 177.997 1002.85 171.612 1001.17 173.288C999.497 174.964 1003.79 200.767 1010.72 230.627C1020.74 273.84 1021.49 293.683 1014.38 327.865C1005.06 372.699 971.481 433.296 939.684 462.679C879.081 518.681 775.811 543.74 708.059 518.884Z"
                    fill={color}
                />
                <path
                    d="M697.365 508.673C656.892 488.727 593.948 413.233 559.264 343.038C532.867 289.615 528.605 273.281 529.117 227.492C529.813 165.192 545.127 124.156 586.542 73.614C643.254 4.40549 751.413 -15.7064 836.102 27.2091L877.569 48.2215L840.859 71.5018C767.225 118.2 684.468 219.23 719.851 219.23C724.084 219.23 754.751 199.712 788 175.857C906.686 90.7033 1048.04 30.7773 1130.22 30.7773C1180.72 30.7773 1195.58 36.7691 1195.58 57.1336C1195.58 76.4771 1112.25 159.409 1069.91 182.214C1041.44 197.547 1040.31 197.559 1023.87 182.685C1014.61 174.299 1004.83 169.636 1002.14 172.322C999.452 175.009 1001.85 202.899 1007.46 234.301C1015.46 279.064 1015.54 299.827 1007.83 330.44C995.219 380.517 964.184 433.296 929.378 463.856C870.566 515.494 756.08 537.608 697.365 508.673Z"
                    fill={color}
                />
                <path
                    d="M971.27 1663.81C967.021 1659.57 963.545 1638.01 963.545 1615.91C963.545 1509.02 904 1420.52 791.888 1360.76C753.867 1340.5 716.562 1323.91 708.99 1323.91C701.418 1323.91 656.578 1342.5 609.347 1365.22C498.088 1418.73 400.287 1434.2 277.606 1417.69C181.124 1404.71 29.1147 1364.35 6.03412 1345.58C-3.647 1337.71 -1.87562 1314.43 12.7746 1256.99L32.6473 1179.07L103.986 1182.83C201.334 1187.96 286.624 1161.37 340.187 1109.19C387.751 1062.86 428.348 968.562 433.188 893.176C436.131 847.335 433.614 842.924 390.55 818.445C328.24 783.025 250.284 773.648 190.208 794.346L142.133 810.909L118.309 732.473C105.206 689.334 94.4849 649.102 94.4849 643.068C94.4849 628.842 231.246 566.591 320.44 540.218C415.725 512.044 580.629 511.674 652.666 539.473C746.316 575.613 824.194 682.728 824.431 775.723C824.466 789.687 829.157 803.992 834.854 807.514C852.679 818.53 882.432 723.879 882.432 656.162C882.432 599.023 884.812 592.414 902.71 599.852C953.028 620.76 1028 640.255 1058.09 640.255H1091.01V559.142V478.03H1345.93H1600.86V611.286V744.542H1485.76C1382.97 744.542 1369.92 746.889 1363.7 766.5C1352.73 801.056 1246.38 894.277 1186.22 922.07C1139.88 943.48 1110.85 947.322 995.422 947.322C920.544 947.322 859.416 949.93 859.581 953.116C859.746 956.303 881.309 971.946 907.499 987.878C981 1032.59 1082.38 1139.93 1122.26 1215.26C1174.96 1314.79 1193.88 1391.41 1202.32 1539.55L1209.84 1671.54H1094.42C1030.93 1671.54 975.518 1668.06 971.27 1663.81Z"
                    fill={color}
                />
                <path
                    d="M1089.06 407.682V366.714H1345.11H1601.16V407.682V448.65H1345.11H1089.06V407.682Z"
                    fill={color}
                />
            </svg>
        </>
    );
};
