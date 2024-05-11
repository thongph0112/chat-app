import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:my_app/pages/home/sign_in.dart';
import 'package:my_app/pages/home/sign_up.dart';

class BottomContainerSignIn extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.blue, // Background color of the container
      padding: EdgeInsets.all(16.0), // Optional: Padding inside the container
      child: Align(
        alignment: Alignment.bottomCenter,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.star, color: Colors.white),
            SizedBox(width: 8.0),
            Text(
              'Bottom Container',
              style: TextStyle(color: Colors.white, fontSize: 18),
            ),
          ],
        ),
      ),
    );
  }
}

class BottomContainerSignUp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16.0), // Optional: Padding inside the container
      decoration: BoxDecoration(
        color: Colors.blue,
        borderRadius:
            BorderRadius.circular(10.0), // Adjust the radius as needed
      ),
      child: Align(
        alignment: Alignment.bottomCenter,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(

              onPressed: () => Navigator.of(context).push(
                  MaterialPageRoute(builder: (context) => const SignIn())),
              child: Text(
                'Đăng kí',
                style: TextStyle(

                  fontFamily: "Roboto",
                  fontSize: 16.0,
                  fontWeight: FontWeight.w400,
                ),
                textAlign: TextAlign.right,
              ),
            )
            // Icon(Icons.star, color: Colors.white),
            // SizedBox(width: 8.0),
          ],
        ),
      ),
    );
  }
}
